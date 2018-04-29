/**
 *  Copyright (c) 2018, Applitopia, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the MIT-style license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 *  @flow
 */

import type { Context, Transducer, Reducer } from 'transducers.js';

//
// Transducer Factory Functions
//

declare function isReduced(x: mixed): boolean;

declare function ensureReduced<T>(v: T): T;

declare function ensureUnreduced<T>(v: T): T;

declare function reducer<T1, T2>(init: () => T2, step: (input: T1) => T2, result: (result: T2) => T2): Reducer<T1, T2>;

declare function transducer<T1, T2, T3>(xf: Reducer<T1, T2>): Transducer<T1, T2, T3>;

declare function process<T1, T2, T3>(processFn: (data: Array<T1>) => Array<T2>): Transducer<T1, T2, T3>;

declare function sort<T1, T2>(cmpFn: (a: T1, b: T1) => number): Transducer<T1, T1, T2>;

declare function group<K, V, T>(aggregator: Reducer<K, V>): Transducer<K, Map<K, V>, T>;

declare function groupBy<T1, K, V, T2>(keyExtractorFn: (input: T1) => K, aggregator: Reducer<[T1, K], V>): Transducer<T1, Map<K, V>, T2>;

//
// Actions
//
// eslint-disable-next-line no-unused-vars
type Operation =
  'MAP' |
  'FILTER' |
  'SORT' |
  'TAKE' |
  'DROP' |
  'REDUCE' |
  'GROUP' |
  'GROUPBY' |
  'CAT';

type MapSpec<V1, V2> = {|
    op: 'MAP',
    fn: (value: V1) => V2,
|};

type FilterSpec<V> = {|
    op: 'FILTER',
    fn: (value: V) => boolean,
|};

type SortSpec<V> = {|
    op: 'SORT',
    fn: (a: V, b: V) => number,
|};

type TakeSpec = {|
    op: 'TAKE',
    cntFn: () => number,
|};

type DropSpec = {|
    op: 'DROP',
    cntFn: () => number,
|};

type ReduceSpec<V1, V2> = {|
    op: 'REDUCE',
    init: () => V2,
    step: (output: V2, input: V1) => V2,
    result: (output: V2) => V2,
|};

type GroupSpec<K, V> = {|
    op: 'GROUP',
    aggregator: Reducer<K, V>,
|};

type GroupBySpec<T, K, V> = {|
    op: 'GROUPBY',
    keyExtractorFn: (input: T) => K,
    aggregator: Reducer<[T, K], V>,
|};

type CatSpec = {|
    op: 'CAT',
|};

type TransformationSpec =
  MapSpec<*, *> |
  FilterSpec<*> |
  SortSpec<*> |
  TakeSpec |
  DropSpec |
  ReduceSpec<*, *> |
  GroupSpec<*, *> |
  GroupBySpec<*, *, *> |
  CatSpec;

// eslint-disable-next-line no-unused-vars
type TransducerRecipe<V1, V2> = Array<TransformationSpec>;

declare function compile<T1, T2, T3>(recipe: TransducerRecipe<T1, T2>, ctx?: Context): Transducer<T1, T2, T3>;
