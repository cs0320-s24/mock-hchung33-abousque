import { expect, test } from "@playwright/test";

/**
  The general shapes of tests in Playwright Test are:
    1. Navigate to a URL
    2. Interact with the page
    3. Assert something about the page against your expectations
  Look for this pattern in the tests below!
 */

// If you needed to do something before every test case...
test.beforeEach(() => {
  // ... you'd put it here.
  // TODO: Is there something we need to do before every test case to avoid repeating code?
});

/**
 * Test visible login button.
 */
test("on page load, i see a login button", async ({ page }) => {
  // Notice: http, not https! Our front-end is not set up for HTTPs.
  await page.goto("http://localhost:8000/");
  await expect(page.getByLabel("Login")).toBeVisible();
});

/**
 * Test that nothing can be entered until user has logged in.
 *
 * This is USER STORY 5.
 */
test("on page load, i dont see the input box until login", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await expect(page.getByLabel("Sign Out")).not.toBeVisible();
  await expect(page.getByLabel("Command input")).not.toBeVisible();

  // click the login button
  await page.getByLabel("Login").click();
  await expect(page.getByLabel("Sign Out")).toBeVisible();
  await expect(page.getByLabel("Command input")).toBeVisible();
});

/**
 * Test input box reacts to text.
 */
test("after I type into the input box, its text changes", async ({ page }) => {
  // Step 1: Navigate to a URL
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();

  // Step 2: Interact with the page
  // Locate the element you are looking for
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("Awesome command");

  // Step 3: Assert something about the page
  // Assertions are done by using the expect() function
  const mock_input = `Awesome command`;
  await expect(page.getByLabel("Command input")).toHaveValue(mock_input);
});

/**
 * Test submit button appears on Login.
 */
test("on page load, i see a button", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();
  await expect(page.getByRole("button", { name: "Submit" })).toBeVisible();
});

/**
 * Test that button reacts with input box as intended.
 */
test("after I click the button, my command gets pushed", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("Awesome command");
  await page.getByRole("button", { name: "Submit" }).click();

  // you can use page.evaulate to grab variable content from the page for more complex assertions
  const firstChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[0]?.textContent;
  });
  expect(firstChild?.trim()).toEqual("Entered unrecognized command");
});

/**
 * Test that you can't see old text after logging out then in again.
 */
test("after I log out then log in, I can't see old output", async ({
  page,
}) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("test");
  await page.getByRole("button", { name: "Submit" }).click();

  // check that result is printed to terminal
  await expect(page.getByText("Entered unrecognized command")).toBeVisible();

  await page.getByLabel("Sign Out").click();
  await page.getByLabel("Login").click();

  // check that we no longer see the old restricted data
  const replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[0]?.textContent;
  });
  expect(replHistory).toEqual(undefined);
});

/**
 * Test that you can't type input once logged out.
 */
test("after I log out, I can't enter any more text", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();
  await page.getByLabel("Sign Out").click();

  await expect(page.getByLabel("Command input")).not.toBeVisible();
});

/**
 * Test correct mode switch to verbose then back to brief.
 */
test("I can switch from brief to verbose and back with correct outputs", async ({
  page,
}) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").click();

  // set verbose mode
  let command = "mode verbose";
  let expectedResponse = "Mode set to verbose";

  await page.getByLabel("Command input").fill(command);
  await page.getByRole("button", { name: "Submit" }).click();
  let replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[0]?.innerHTML; // Extracting HTML table content
  });
  expect(replHistory).toContain(
    "<tr><td>Command: " +
      command +
      "</td></tr><tr><td>Output:</td></tr>" +
      "<table><tr><td>" +
      expectedResponse +
      "</td></tr><p></p></table>"
  );

  // set back to brief mode
  command = "mode verbose";
  expectedResponse = "Mode set to verbose";

  await page.getByLabel("Command input").fill(command);
  await page.getByRole("button", { name: "Submit" }).click();
  replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[1]?.innerHTML; // Extracting HTML table content
  });
  expect(replHistory).toContain(
    "<table><tr><td>" + expectedResponse + "</td></tr><p></p></table>"
  );
});

/**
 * Test that entering no command then hitting submit doesn't result in anything. (BRIEF)
 */
test("after entering no command, I get no output, in brief", async ({
  page,
}) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").click();

  // entering nothing
  await page.getByLabel("Command input").fill("");
  await page.getByRole("button", { name: "Submit" }).click();
  let replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[0]?.textContent;
  });
  expect(replHistory).toEqual(undefined);

  // entering whitespace
  await page.getByLabel("Command input").fill("     ");
  await page.getByRole("button", { name: "Submit" }).click();
  replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[0]?.textContent;
  });
  expect(replHistory).toEqual(undefined);
});

/**
 * Test that entering no command then hitting submit doesn't result in anything. (VERBOSE)
 */
test("after entering no command, I get no output, in verbose", async ({
  page,
}) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").click();

  // set verbose mode
  await page.getByLabel("Command input").fill("mode verbose");
  await page.getByRole("button", { name: "Submit" }).click();

  // entering nothing
  await page.getByLabel("Command input").fill("");
  await page.getByRole("button", { name: "Submit" }).click();
  let replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[1]?.textContent;
  });
  expect(replHistory).toEqual(undefined);

  // entering whitespace
  await page.getByLabel("Command input").fill("     ");
  await page.getByRole("button", { name: "Submit" }).click();
  replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[1]?.textContent;
  });
  expect(replHistory).toEqual(undefined);
});

/**
 * Test error message on unrecognized command. (BRIEF)
 */
test("after entering an unrecognized command, I get an error message, in brief", async ({
  page,
}) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").click();

  await page.getByLabel("Command input").fill("invalid command and/or args");
  await page.getByRole("button", { name: "Submit" }).click();
  let replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[0]?.textContent;
  });
  expect(replHistory?.trim()).toEqual("Entered unrecognized command");
});

/**
 * Test error message on unrecognized command. (VERBOSE)
 */
test("after entering an unrecognized command, I get an error message, in verbose", async ({
  page,
}) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").click();

  // set verbose mode
  await page.getByLabel("Command input").fill("mode verbose");
  await page.getByRole("button", { name: "Submit" }).click();

  const command = "invalid command and/or args";
  const expectedResponse = "Entered unrecognized command";

  await page.getByLabel("Command input").fill(command);
  await page.getByRole("button", { name: "Submit" }).click();
  let replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[1]?.innerHTML; // Extracting HTML table content
  });

  // Assert specific content within the HTML table
  expect(replHistory).toContain(
    "<tr><td>Command: " +
      command +
      "</td></tr><tr><td>Output:</td></tr>" +
      "<table><tr><td>" +
      expectedResponse +
      "</td></tr><p></p></table>"
  );
});

/**
 * Test correctly formatted load output. (BRIEF)
 */
test("after entering a valid load, I get correct output in brief", async ({
  page,
}) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").click();

  await page.getByLabel("Command input").fill("load_file numbers.csv");
  await page.getByRole("button", { name: "Submit" }).click();
  let replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[0]?.textContent;
  });
  expect(replHistory?.trim()).toEqual("Successfully loaded CSV at numbers.csv");
});

/**
 * Test correctly formatted load output. (VERBOSE)
 */
test("after entering a valid load, I get correct output in verbose", async ({
  page,
}) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").click();

  // set verbose mode
  await page.getByLabel("Command input").fill("mode verbose");
  await page.getByRole("button", { name: "Submit" }).click();

  const command = "load_file numbers.csv";
  const expectedResponse = "Successfully loaded CSV at numbers.csv";

  await page.getByLabel("Command input").fill(command);
  await page.getByRole("button", { name: "Submit" }).click();
  let replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[1]?.innerHTML; // Extracting HTML table content
  });

  // Assert specific content within the HTML table
  expect(replHistory).toContain(
    "<tr><td>Command: " +
      command +
      "</td></tr><tr><td>Output:</td></tr>" +
      "<table><tr><td>" +
      expectedResponse +
      "</td></tr><p></p></table>"
  );
});

// /**
//  * Test
//  */
// test("", async ({ page }) => {});

/**
 * E2E
//  * - can you enter text without hitting login
//  * - can you logout then enter text
//  * - entering nothing
//  * - entering spaces
//  * - entering nonexistent command
//  * - load correct
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
//  * - output of mode verbose
//  * - output of mode brief
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
//  * - log in, type valid command, log out, check that box is empty
 * - log in, type valid command, log out, log in, view (fails)
 * - search with column in number, column in string
 */
