/*
// @flow
*/

import type { ReducedType, Reducer, Transducer } from 'transducers.js';
import { reduce } from 'transducers.js';
import { Map } from 'immutable-sorted';

function Reduced<T>(value: T): ReducedType<T> {
	return {
		'@@transducer/reduced': true,
		'@@transducer/value': value,
	};
}

export function isReduced(x: mixed): boolean {
  return (x instanceof Reduced) || (typeof x === 'object' && x !== null && x['@@transducer/reduced'] !== undefined);
}

function deref<T>(x: T): T {
  return ((x: any)['@@transducer/value']: T);
}

export function ensureReduced<T>(v: T): T {
  if(isReduced(v)) {
    return v;
  } else {
    return (new Reduced(v): any);
  }
}

export function ensureUnreduced<T>(v: T): T {
  if(isReduced(v)) {
    return deref(v);
  } else {
    return v;
  }
}

export function reducer<T1, T2>(init: () => T2, step: (result: T2, input: T1) => T2, result: (result: T2) => T2): Reducer<T1, T2>
{
		const t: Reducer<T1, T2> = {
				'@@transducer/init': (init ? init : function(): T2 {
						throw new Error('init value unavailable');
				}),
				'@@transducer/step': step,
				'@@transducer/result': (result ? result : function(v: T2): T2 {
						return v;
				})
		};

		return t;
}

export function transducer<T1, T2, T3>(xf1: Reducer<T1, T2>): Transducer<T1, T2, T3> {
		return function(xf2: Reducer<T2, T3>): Reducer<T1, T3> {
				let mid: T2;
				let started: boolean = false;
				return reducer(
						() => {
							return xf2['@@transducer/init']();
						},
						(result: T3, input: T1) => {
								if(!started) {
									mid = xf1['@@transducer/init']();
									started = true;
								}
								mid = xf1['@@transducer/step'](mid, input);
                if(isReduced(mid)) {
                  mid = deref(mid);
                  result = ensureReduced(result);
                }
								return result;
						},
						(result: T3) => {
								mid = xf1['@@transducer/result'](mid);
								result = xf2['@@transducer/step'](result, mid);
								return xf2['@@transducer/result'](result);
						}
				);
		}
}

export function process<T1, T2, T3>(processFn: (data: Array<T1>) => Array<T2>): Transducer<T1, T2, T3> {
		const collectedData: Array<T1> = [];
		return function(xf: Reducer<T2, T3>): Reducer<T1, T3> {
				return reducer(
						()=>xf['@@transducer/init'](),
						(result: T3, input: T1) => {
								collectedData.push(input);
								return result;
						},
						(result: T3) => {
								const processedData: Array<T2> = processFn(collectedData);
								return reduce(processedData, xf, result);
						});
		}
}

export function sort<T1, T2>(cmpFn: (a: T1, b: T1) => number): Transducer<T1, T1, T2> {
		return process((data: Array<T1>) => (data.sort(cmpFn)));
}

export function group<K, V, T>(aggregator: Reducer<K, V>): Transducer<K, Map<K, V>, T> {
	const xf: Reducer<K, Map<K, V>> = reducer(
		() => {
			return Map().asMutable();
		},
		(result: Map<K, V>, input: K) => {
			const key: K = input;
			if(result.has(key)) {
				result.update(key, (value: V) => aggregator['@@transducer/step'](value, input));
			} else {
				result.set(key, aggregator['@@transducer/init']());
			}
			return result;
		},
		(result: Map<K, V>) => {
				return result.asImmutable();
		}
	);

	return transducer(xf);
}

export function groupBy<T1, K, V, T2>(keyExtractorFn: (input: T1) => K, aggregator: Reducer<[T1, K], V>): Transducer<T1, Map<K, V>, T2> {
	const xf: Reducer<T1, Map<K, V>> = reducer(
		() => {
			return Map().asMutable();
		},
		(result: Map<K, V>, input: T1) => {
			const key: K = keyExtractorFn(input);
			if(result.has(key)) {
				result.update(key, (value: V) => aggregator['@@transducer/step'](value, [input, key]));
			} else {
				result.set(key, aggregator['@@transducer/init']());
			}
			return result;
		},
		(result: Map<K, V>) => {
				return result.asImmutable();
		}
	);

	return transducer(xf);
}
