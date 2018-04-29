/**
 *  Copyright (c) 2018, Applitopia, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the MIT-style license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 *  @flow
 */

import { List, Map } from 'immutable-sorted';

import { seq, into, map } from 'transducers.js';

import type { Transducer } from 'transducers.js';

test("object", function() {
  const arr = [];
  into(arr, map((x)=>x), ({a: 1, b: 2, c: 3}: any));
  for(let s: string of arr) {
    expect(s).toBeTruthy();
  }
});

test("array", function() {
  let list: Array<string> = [];
  list.push("a", "b", "c");
  const it: Iterable<string> = list;
  for(let s: string of it) {
    expect(s).toBeTruthy();
  }
});

test("iterable", function() {
  let list: List<string> = List();
  list = list.push("a", "b", "c");
  const it: Iterable<string> = list;
  for(let s: string of it) {
    expect(s).toBeTruthy();
  }
});

test("map", function() {

  const xf1: Transducer<number, number, Iterable<number>> = map((n: number): number => (n+1));
  const data1: Iterable<number> = [4, 3, 2, 1, 0];
  const result1: Iterable<number> = seq(data1, xf1);
  expect(result1).toEqual([5, 4, 3, 2, 1]);

  const xf2: Transducer<[string, number], [string, number], Iterable<[string, number]>> = map((n: [string,number]): [string,number] => [n[0],n[1]+1]);
  const data2: Iterable<[string, number]> = Map({a: 4, b:3, c:2, d:1, e:0});
  const result2: Iterable<[string, number]> = seq(data2, xf2);
  expect(result2).toEqual(Map({a: 5, b:4, c:3, d:2, e:1}));

  const xf3: Transducer<number, number, List<number>> = map((n: number): number => (n+1));
  const data3: List<number> = List([4, 3, 2, 1, 0]);
  const result3: List<number> = into(List(), xf3, data3);
  expect(result3).toEqual(List([5, 4, 3, 2, 1]));

  const xf4: Transducer<number, number, Iterable<number>> = map((n: number): number => (n+1));
  const data4: Iterable<number> = List([4, 3, 2, 1, 0]);
  const result4: Iterable<number> = into(List(), xf4, data4);
  expect(result4).toEqual(List([5, 4, 3, 2, 1]));

});
