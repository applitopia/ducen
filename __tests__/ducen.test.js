/**
 *  Copyright (c) 2018, Applitopia, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the MIT-style license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 *  @flow
 */

import { compile } from '../src';

import { reducer, ensureReduced } from '../src';
import { seq, into } from 'transducers.js';

import type { Transducer } from 'transducers.js';

test("drop operation", function() {

  let recipe: TransducerRecipe<number, number> = [
    {
      op: 'DROP',
      cntFn: () => 5,
    }
  ];
  const xf: Transducer<number, number, Array<number>> = compile(recipe);
  expect(seq([11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], xf)).toEqual([6, 5, 4, 3, 2, 1]);
});

test("reduce operation", function() {

  let recipe: TransducerRecipe<number, number> = [
    {
      op: 'REDUCE',
      init: () => 0,
      step: (total: number, input: number) => (total + input),
      result: (total: number) => total,
    }
  ];
  const xf: Transducer<number, number, Array<number>> = compile(recipe);
  expect(seq([11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], xf)).toEqual([66]);
});

test("reduce operation with early termination", function() {

  let recipe: TransducerRecipe<number, number> = [
    {
      op: 'REDUCE',
      init: () => 0,
      step: (total: number, input: number) => (input !== 7 ? (total + input) : ensureReduced(total + input)),
      result: (total: number) => total,
    }
  ];
  const xf: Transducer<number, number, Array<number>> = compile(recipe);
  expect(seq([11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], xf)).toEqual([45]);
  expect(seq([11, 11, 9, 8, 7, 6, 5, 4, 3, 2, 1], xf)).toEqual([46]);
  expect(seq([11, 10, 11, 8, 7, 6, 5, 4, 3, 2, 1], xf)).toEqual([47]);
  expect(seq([11, 10, 9, 11, 7, 6, 5, 4, 3, 2, 1], xf)).toEqual([48]);
  expect(seq([11, 10, 9, 12, 7, 6, 5, 4, 3, 2, 1], xf)).toEqual([49]);
});

test("reduce operation with early termination with this context", function() {

  let recipe: TransducerRecipe<number, number> = [
    {
      op: 'REDUCE',
      init: () => {this.cnt = 0; return 0;},
      step: (total: number, input: number) => (++this.cnt < 5 ? (total + input) : ensureReduced(total + input)),
      result: (total: number) => total,
    }
  ];
  const xf: Transducer<number, number, Array<number>> = compile(recipe);
  expect(seq([11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], xf)).toEqual([45]);
  expect(seq([11, 11, 9, 8, 7, 6, 5, 4, 3, 2, 1], xf)).toEqual([46]);
  expect(seq([11, 10, 11, 8, 7, 6, 5, 4, 3, 2, 1], xf)).toEqual([47]);
  expect(seq([11, 10, 9, 11, 7, 6, 5, 4, 3, 2, 1], xf)).toEqual([48]);
  expect(seq([11, 10, 9, 12, 7, 6, 5, 4, 3, 2, 1], xf)).toEqual([49]);
});

test("sort+reduce", function() {

  let recipe: TransducerRecipe<number, number> = [
    {
      op: 'SORT',
      fn: (a: number, b: number): number => (a - b)
    },
    {
      op: 'REDUCE',
      init: () => 0,
      step: (total: number, input: number) => (total + input),
      result: (total: number) => total,
    }
  ];
  const xf: Transducer<number, number, Array<number>> = compile(recipe);
  expect(seq([11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], xf)).toEqual([66]);
});

test("multiple transformation", function() {
  let recipe: TransducerRecipe<number, number> = [
    {
      op: 'MAP',
      fn: (x: number): number => (x + 1)
    },
    {
      op: 'FILTER',
      fn: (x: number): boolean => (x % 2 === 0)
    },
    {
      op: 'SORT',
      fn: (a: number, b: number): number => (a - b)
    },
    {
      op: 'TAKE',
      cntFn: () => 5
    },
    {
      op: 'REDUCE',
      init: () => 0,
      step: (total: number, input: number) => (total + input),
      result: (total: number) => total,
    }
  ];
  const xf: Transducer<number, number, Array<number>> = compile(recipe);
  const input: Array<number> = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
  const output: Array<number> = seq(input, xf);
  expect(output).toEqual([30]);
});

test("groupBy", function() {
  const cmp = (a: string, b: string): number => a > b ? 1 : (b > a ? -1 : 0);

  let recipe: TransducerRecipe<string, Map<string, number>> = [
    {
      op: 'GROUPBY',
      keyExtractorFn: (input: string) => input,
      aggregator: reducer(
        () => 1,
        // eslint-disable-next-line no-unused-vars
        (result: number, input: [string, string]) => (result+1),
        (result: number) => result
      ),
    },
    {
      op: 'CAT',
    },
    {
      op: 'SORT',
      fn: (a: [string, number], b: [string, number]): number => (b[1] - a[1] || cmp(a[0], b[0])),
    },
    {
      op: 'TAKE',
      cntFn: () => 3,
    }
  ];

  const xf: Transducer<string, Map<string, number>, Array<Map<string, number>>> = compile(recipe);
  const result: Array<Map<string, number>> = [];
  into(result, xf, ["John", "Peter", "Steve", "Adam", "Steve", "Steve", "John"])
  expect(result).toEqual([["Steve", 3], ["John", 2], ["Adam", 1]]);

});

test("group", function() {
  const cmp = (a: string, b: string): number => a > b ? 1 : (b > a ? -1 : 0);

  let recipe: TransducerRecipe<string, Map<string, number>> = [
    {
      op: 'GROUP',
      aggregator: reducer(
        () => 1,
        // eslint-disable-next-line no-unused-vars
        (result: number, input: string) => (result+1),
        (result: number) => result
      ),
    },
    {
      op: 'CAT',
    },
    {
      op: 'SORT',
      fn: (a: [string, number], b: [string, number]): number => (b[1] - a[1] || cmp(a[0], b[0])),
    },
    {
      op: 'TAKE',
      cntFn: () => 3,
    }
  ];

  const xf: Transducer<string, Map<string, number>, Array<Map<string, number>>> = compile(recipe);
  const result: Array<Map<string, number>> = [];
  into(result, xf, ["John", "Peter", "Steve", "Adam", "Steve", "Steve", "John"])
  expect(result).toEqual([["Steve", 3], ["John", 2], ["Adam", 1]]);

});
