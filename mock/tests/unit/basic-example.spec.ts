import { expect, test } from "vitest";

import * as REPLInput from "../../src/components/REPL/REPLInput";

test("is 1 + 1 = 2?", () => {
  expect(1 + 1).toBe(2);
});

/**
 * UNIT TESTS WE COVERED IN E2E OUT OF NECESSITY:
 * Please see tests/e2e/App.spec.ts to see these tests in context.
 * These would mainly test the edge cases caught by our REPLFunctions in REPLInput.
 * Please see our ed post #351 for more explanation on why we could not run
 * isolated unit tests.
 *
 * - mode with wrong number args
 * - load with wrong number args
 * - view with wrong number args
 * - search with wrong number args
 * - view before load
 * - search before load
 * - load with data not available
 * - mode success
 * - load success
 * - view success
 * - search success
 */

// For more information on how to make unit tests, visit:
// https://jestjs.io/docs/using-matchers
