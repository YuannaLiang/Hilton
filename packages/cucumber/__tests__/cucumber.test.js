'use strict';

const cucumber = require('..');
const assert = require('assert').strict;

assert.strictEqual(cucumber(), 'Hello from cucumber');
console.info('cucumber tests passed');
