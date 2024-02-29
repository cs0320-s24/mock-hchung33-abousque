import { expect, test } from "vitest";

import * as REPLInput from "../../src/components/REPLInput";

test("is 1 + 1 = 2?", () => {
  expect(1 + 1).toBe(2);
});

// // Notice how you can test vanilla TS functions using Playwright as well!
// test('main.zero() should return 0', () => {
//   expect(main.zero()).toBe(0)
// })

/**
 * Test that calling mode with the wrong number of arguments returns error msg.
 */
// test('mode with wrong number args', () => {
//     expect(REPLInput.setMode)
// })

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
 * - mode success!
 * - setMode, checking brief value before and after? both ways
 */

// For more information on how to make unit tests, visit:
// https://jestjs.io/docs/using-matchers
