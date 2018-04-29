/**
 *  Copyright (c) 2018, Applitopia, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the MIT-style license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 *  @flow
 */

//
// Items from transducers.js
//

/*
import {
  reduce,
  transformer,
  Reduced,
  iterator,
  transduce,
  seq,
  toArray,
  toObj,
  toIter,
  into,

  compose,
  map,
  filter,
  remove,
  cat,
  mapcat,
  keep,
  dedupe,
  take,
  takeWhile,
  takeNth,
  drop,
  dropWhile,
  partition,
  partitionBy,
  interpose,
  repeat,
 } from 'transducers.js';

export {
  reduce,
  transformer,
  Reduced,
  iterator,
  transduce,
  seq,
  toArray,
  toObj,
  toIter,
  into,

  compose,
  map,
  filter,
  remove,
  cat,
  mapcat,
  keep,
  dedupe,
  take,
  takeWhile,
  takeNth,
  drop,
  dropWhile,
  partition,
  partitionBy,
  interpose,
  repeat,
};
*/

//
// Items from ducen
//

import {
  isReduced,
  ensureReduced,
  ensureUnreduced,
  reducer,
  transducer,
  process,
  sort,
  group,
  groupBy,
} from './transducers.js';

export {
  isReduced,
  ensureReduced,
  ensureUnreduced,
  reducer,
  transducer,
  process,
  sort,
  group,
  groupBy,
};

import { compile } from './ducen';

export {
  compile
};

export default {
  compile
};
