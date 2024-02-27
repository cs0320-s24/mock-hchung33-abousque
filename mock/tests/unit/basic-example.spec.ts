/*
  Demo: test ordinary Java/TypeScript
*/

import { expect, test } from 'vitest';

// all exports from main will now be available as main.X
// import * as main from '../mock/src/main';
import * as main from '../../src/main';

test('is 1 + 1 = 2?', () => {
  expect(1 + 1).toBe(2)
})

// Notice how you can test vanilla TS functions using Playwright as well!
test('main.zero() should return 0', () => {
  expect(main.zero()).toBe(0)
})

test('mode with wrong number args', () => {})

test("load with wrong number args", () => {});

test("view with wrong number args", () => {});

test("search with wrong number args", () => {});

/**
 * UNIT
 * - mode with wrong number args
 * - load with wrong number args
 * - view with wrong number args
 * - search with wrong number args
 * - view before load
 * - search before load
 * - load with data not available
 * - setMode, checking brief value before and after? both ways
 */

/**
 * E2E
 * - can you enter text without hitting login
 * - can you logout then enter text
 * - entering nothing
 * - entering spaces
 * - entering nonexistent command
 * - load correct
 * - view correct
 * - search correct
 * - wrong load then correct load
 * - wrong view then correct view
 * - wrong search then correct search
 * - load then view then load then view
 * - load then search then load then search
 * - load then view then search then load then view
 * - mode with wrong number args
 * - load with wrong number args
 * - view with wrong number args
 * - search with wrong number args
 * - view before load
 * - search before load
 * - load with data not available
 * - output of mode verbose
 * - output of mode brief
 * - load then verbose then view
 * - load then search then verbose then search then brief then search
 * - search where result is empty
 * - search where result is 1 row
 * - search where result is many rows
 * - view with many rows/cols
 * - view with one row
 * - view with one col
 * - view numbers
 * - view strings
 * - log in, type valid command, log out, check that box is empty
 * - log in, type valid command, log out, log in, view (fails)
 * - search with column in number, column in string
*/

// For more information on how to make unit tests, visit:
// https://jestjs.io/docs/using-matchers