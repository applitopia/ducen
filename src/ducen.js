/**
 *  Copyright (c) 2018, Applitopia, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the MIT-style license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 *  @flow
 */

import { reducer, sort, transducer, group, groupBy } from '.';
import { map, filter, compose, cat, take, drop } from 'transducers.js';
import type { Context, Transducer } from 'transducers.js';

export function compile<T1, T2, T3>(recipe: TransducerRecipe<T1, T2>, ctx?: Context): Transducer<T1, T2, T3> {
  const compiledSpec: Array<Transducer<*, *, *>> = [];

  for(let i: number = 0; i < recipe.length; i++) {
    let csp: Transducer<*, *, *>;

    const sp: TransformationSpec = recipe[i];
    switch(sp.op) {
    case 'MAP': {
      csp = map(sp.fn, ctx);
      break;
    }
    case 'FILTER': {
      csp = filter(sp.fn, ctx);
      break;
    }
    case 'SORT': {
      csp = sort(sp.fn);
      break;
    }
    case 'TAKE': {
      csp = take(sp.cntFn());
      break;
    }
    case 'DROP': {
      csp = drop(sp.cntFn());
      break;
    }
    case 'REDUCE': {
      csp = transducer(reducer(sp.init, sp.step, sp.result));
      break;
    }
    case 'GROUP': {
      csp = group(sp.aggregator);
      break;
    }
    case 'GROUPBY': {
      csp = groupBy(sp.keyExtractorFn, sp.aggregator);
      break;
    }
    case 'CAT': {
      csp = cat;
      break;
    }
    default: {
      throw new Error("Unknown Transformer Operation: "+ sp.op);
    }
    }

    compiledSpec.push(csp);
  }

  return compose.apply(null, compiledSpec);
}

