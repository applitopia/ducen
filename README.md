![ducen](http://applitopia.github.io/ducen/ducen.svg)

DUCEN - The Transducer Engine
=====
[![npm version](https://badge.fury.io/js/ducen.svg)](https://badge.fury.io/js/ducen)
[![jest](https://img.shields.io/badge/tested_with-jest-brightgreen.svg)](https://facebook.github.io/jest/)
[![dependencies](https://img.shields.io/david/applitopia/ducen.svg)](https://david-dm.org/applitopia/ducen)
[![devDependencies](https://img.shields.io/david/dev/applitopia/ducen.svg)](https://david-dm.org/applitopia/ducen?type=dev)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

This package is an extension of [transducers.js](https://github.com/jlongster/transducers.js) library. The following features have been added:

1. flow types
2. additional transducers: sort, group, groupBy
3. additional utility functions: reducer, transducer, process
4. transducer recipes
5. incremental processing of updates

Installation
------------

```shell
npm install ducen
```

Example
-------

Transducer recipe:

```js
var { compile } = require('ducen');
var { seq } = require('transducers.js');

// Define transducer recipe
var recipe = [
  {
    op: 'MAP',
    fn: (x) => (x + 1)
  },
  {
    op: 'FILTER',
    fn: (x) => (x % 2 === 0)
  },
  {
    op: 'SORT',
    fn: (a, b) => (a - b)
  },
  {
    op: 'TAKE',
    cntFn: () => 5
  },
  {
    op: 'REDUCE',
    init: () => 0,
    step: (total, input) => (total + input),
    result: (total) => total,
  }
];

// Compile recipe into a tranducer
var xf = compile(recipe);

// Transform input with compiled transducer
var input = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
var output = seq(input, xf);

expect(output).toEqual([30]);
```

With flow types:

```js
import { compile } from 'ducen';
import type { TransducerRecipe } from 'ducen';

import { seq } from 'transducers.js';
import type { Transducer } from 'transducers.js';

// Define transducer recipe
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

// Compile recipe into a tranducer
const xf: Transducer<number, number, Array<number>> = compile(recipe);

// Transform input with compiled transducer
const input: Array<number> = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
const output: Array<number> = seq(input, xf);

expect(output).toEqual([30]);
```

Development
-----------

Setup:

```shell
git clone https://github.com/applitopia/ducen.git
cd ducen
npm install
```

Lint:
```shell
npm run lint
```

Build:
```shell
npm run build
```

Test:
```shell
npm test
```

Lint, Build, & Test:
```shell
npm run all
```

Update Dependencies:
```shell
npm update --save
```

License
-------

MIT
