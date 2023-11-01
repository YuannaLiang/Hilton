'use strict';

const apollo = require('..');
const assert = require('assert').strict;

assert.strictEqual(apollo(), 'Hello from apollo');
console.info('apollo tests passed');
