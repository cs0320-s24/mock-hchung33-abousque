import { expect, test } from "@playwright/test";

/**
 * Before each test, navigate to the localhost endpoint
 * (Step 1 of playwright test workflow).
 */
test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:8000/");
});

/**
 * Test visible login button.
 */
test("on page load, i see a login button", async ({ page }) => {
  await expect(page.getByLabel("Login")).toBeVisible();
});

/**
 * Test that nothing can be entered until user has logged in.
 *
 * This is USER STORY 5.
 */
test("on page load, i dont see the input box until login", async ({ page }) => {
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
  await page.getByLabel("Login").click();
  await expect(page.getByRole("button", { name: "Submit" })).toBeVisible();
});

/**
 * Test that button reacts with input box as intended.
 */
test("after I click the button, my command gets pushed", async ({ page }) => {
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
 * Test that you can't access old data after logging out then in again.
 */
test("after I log out then log in, data is no longer loaded from last session", async ({
  page,
}) => {
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").click();

  // load a file
  await page.getByLabel("Command input").fill("load_file numbers.csv");
  await page.getByRole("button", { name: "Submit" }).click();

  // check success
  let replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[0]?.textContent;
  });
  expect(replHistory?.trim()).toEqual("Successfully loaded CSV at numbers.csv");

  // sign out and back in to start a new session
  await page.getByLabel("Sign Out").click();
  await page.getByLabel("Login").click();

  // check that we no longer can access restricted data from previous session
  await page.getByLabel("Command input").fill("view");
  await page.getByRole("button", { name: "Submit" }).click();
  replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[0]?.textContent;
  });
  expect(replHistory).toEqual("Attempted to view CSV before loading CSV");
});

/**
 * Test view and search (correct commands) with many row/col numerical data.
 * Search results are one row, many col. (BRIEF)
 */
test("after loading a valid numerical csv, I can view & search it, in brief", async ({
  page,
}) => {
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").click();

  // load the csv
  await page.getByLabel("Command input").fill("load_file numbers.csv");
  await page.getByRole("button", { name: "Submit" }).click();

  // view it
  const command = "view";
  const data = [
    [1, 2, 3, 4, 5],
    [5, 4, 3, 2, 1],
    [0, 1, 0, 1, 0],
  ];
  const expectedResponse = data
    .map(
      (row, index) =>
        "<tr>" +
        row.map((cell, index) => "<td>" + cell + "</td>").join("") +
        "</tr>"
    )
    .join("");

  await page.getByLabel("Command input").fill(command);
  await page.getByRole("button", { name: "Submit" }).click();
  let replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[1]?.innerHTML; // Extracting HTML table content
  });
  expect(replHistory).toContain(expectedResponse);

  // search it
  const searchCommand = "search 1 1";
  const searchResultData = [[0, 1, 0, 1, 0]];
  const expectedSearchResponse = searchResultData
    .map(
      (row, index) =>
        "<tr>" +
        row.map((cell, index) => "<td>" + cell + "</td>").join("") +
        "</tr>"
    )
    .join("");

  await page.getByLabel("Command input").fill(searchCommand);
  await page.getByRole("button", { name: "Submit" }).click();
  replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[2]?.innerHTML; // Extracting HTML table content
  });
  expect(replHistory).toContain(expectedSearchResponse);
});

/**
 * Test view and search (correct commands) with many row/col numerical data.
 * Search results are one row, many col. (VERBOSE)
 */
test("after loading a valid numerical csv, I can view & search it, in verbose", async ({
  page,
}) => {
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").click();

  // load the csv
  await page.getByLabel("Command input").fill("load_file numbers.csv");
  await page.getByRole("button", { name: "Submit" }).click();

  // set verbose mode
  await page.getByLabel("Command input").fill("mode verbose");
  await page.getByRole("button", { name: "Submit" }).click();

  // view it
  const command = "view";
  const data = [
    [1, 2, 3, 4, 5],
    [5, 4, 3, 2, 1],
    [0, 1, 0, 1, 0],
  ];
  const expectedResponse = data
    .map(
      (row, index) =>
        "<tr>" +
        row.map((cell, index) => "<td>" + cell + "</td>").join("") +
        "</tr>"
    )
    .join("");

  await page.getByLabel("Command input").fill(command);
  await page.getByRole("button", { name: "Submit" }).click();
  let replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[2]?.innerHTML; // Extracting HTML table content
  });
  expect(replHistory).toContain(
    "<tr><td>Command: " +
      command +
      "</td></tr><tr><td>Output:</td></tr>" +
      "<table>" +
      expectedResponse +
      "<p></p></table>"
  );

  // search it
  const searchCommand = "search 1 1";
  const searchResultData = [[0, 1, 0, 1, 0]];
  const expectedSearchResponse = searchResultData
    .map(
      (row, index) =>
        "<tr>" +
        row.map((cell, index) => "<td>" + cell + "</td>").join("") +
        "</tr>"
    )
    .join("");

  await page.getByLabel("Command input").fill(searchCommand);
  await page.getByRole("button", { name: "Submit" }).click();
  replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[3]?.innerHTML; // Extracting HTML table content
  });
  expect(replHistory).toContain(
    "<tr><td>Command: " +
      searchCommand +
      "</td></tr><tr><td>Output:</td></tr>" +
      "<table>" +
      expectedSearchResponse +
      "<p></p></table>"
  );
});

/**
 * Test view and search (correct commands) with many row/col string data.
 * Search results are many rows, many col. (BRIEF)
 */
test("after loading a valid string csv, I can view & search it, in brief", async ({
  page,
}) => {
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").click();

  // load the csv
  await page.getByLabel("Command input").fill("load_file names_and_ages.csv");
  await page.getByRole("button", { name: "Submit" }).click();

  // view
  const command = "view";
  const data = [
    ["first_name", "last_name", "age"],
    ["Harry", "Potter", "56"],
    ["Danny", "Fish", "23"],
    ["Harry", "Harry", "12"],
  ];
  const expectedResponse = data
    .map(
      (row, index) =>
        "<tr>" +
        row.map((cell, index) => "<td>" + cell + "</td>").join("") +
        "</tr>"
    )
    .join("");

  await page.getByLabel("Command input").fill(command);
  await page.getByRole("button", { name: "Submit" }).click();
  let replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[1]?.innerHTML; // Extracting HTML table content
  });
  expect(replHistory).toContain(expectedResponse);

  // search it
  const searchCommand = "search 0 Harry";
  const searchResultData = [
    ["Harry", "Potter", "56"],
    ["Harry", "Harry", "12"],
  ];
  const expectedSearchResponse = searchResultData
    .map(
      (row, index) =>
        "<tr>" +
        row.map((cell, index) => "<td>" + cell + "</td>").join("") +
        "</tr>"
    )
    .join("");

  await page.getByLabel("Command input").fill(searchCommand);
  await page.getByRole("button", { name: "Submit" }).click();
  replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[2]?.innerHTML; // Extracting HTML table content
  });
  expect(replHistory).toContain(expectedSearchResponse);
});

/**
 * Test view and search (correct commands) with many row/col string data.
 * Search results are many rows, many col.
 * Searches by column name and by index. (VERBOSE)
 */
test("after loading a valid string csv, I can view & search it, in verbose", async ({
  page,
}) => {
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").click();

  // load the csv
  await page.getByLabel("Command input").fill("load_file names_and_ages.csv");
  await page.getByRole("button", { name: "Submit" }).click();

  // view
  const command = "view";
  const data = [
    ["first_name", "last_name", "age"],
    ["Harry", "Potter", "56"],
    ["Danny", "Fish", "23"],
    ["Harry", "Harry", "12"],
  ];
  const expectedResponse = data
    .map(
      (row, index) =>
        "<tr>" +
        row.map((cell, index) => "<td>" + cell + "</td>").join("") +
        "</tr>"
    )
    .join("");

  // set verbose mode
  await page.getByLabel("Command input").fill("mode verbose");
  await page.getByRole("button", { name: "Submit" }).click();

  // user command to test
  await page.getByLabel("Command input").fill(command);
  await page.getByRole("button", { name: "Submit" }).click();
  let replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[2]?.innerHTML; // Extracting HTML table content
  });
  expect(replHistory).toContain(
    "<tr><td>Command: " +
      command +
      "</td></tr><tr><td>Output:</td></tr>" +
      "<table>" +
      expectedResponse +
      "<p></p></table>"
  );

  // search it BY COLUMN INDEX
  let searchCommand = "search 0 Harry";
  let searchResultData = [
    ["Harry", "Potter", "56"],
    ["Harry", "Harry", "12"],
  ];
  let expectedSearchResponse = searchResultData
    .map(
      (row, index) =>
        "<tr>" +
        row.map((cell, index) => "<td>" + cell + "</td>").join("") +
        "</tr>"
    )
    .join("");

  await page.getByLabel("Command input").fill(searchCommand);
  await page.getByRole("button", { name: "Submit" }).click();
  replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[3]?.innerHTML; // Extracting HTML table content
  });
  expect(replHistory).toContain(
    "<tr><td>Command: " +
      searchCommand +
      "</td></tr><tr><td>Output:</td></tr>" +
      "<table>" +
      expectedSearchResponse +
      "<p></p></table>"
  );

  // search it BY COLUMN NAME
  searchCommand = "search first_name Harry";
  expectedSearchResponse = searchResultData
    .map(
      (row, index) =>
        "<tr>" +
        row.map((cell, index) => "<td>" + cell + "</td>").join("") +
        "</tr>"
    )
    .join("");

  await page.getByLabel("Command input").fill(searchCommand);
  await page.getByRole("button", { name: "Submit" }).click();
  replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[4]?.innerHTML; // Extracting HTML table content
  });
  expect(replHistory).toContain(
    "<tr><td>Command: " +
      searchCommand +
      "</td></tr><tr><td>Output:</td></tr>" +
      "<table>" +
      expectedSearchResponse +
      "<p></p></table>"
  );
});

/**
 * Test view and search (correct commands) with  single col data.
 * Search results are many rows, one col. (BRIEF AND VERBOSE)
 */
test("after loading a single col csv, I can view & search it, in brief and verbose", async ({
  page,
}) => {
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").click();

  // load the csv
  await page.getByLabel("Command input").fill("load_file one_col.csv");
  await page.getByRole("button", { name: "Submit" }).click();

  // view it (brief)
  let command = "view";
  const data = [["this"], ["csv"], ["has"], ["only"], ["one"], ["column"]];
  let expectedResponse = data
    .map(
      (row, index) =>
        "<tr>" +
        row.map((cell, index) => "<td>" + cell + "</td>").join("") +
        "</tr>"
    )
    .join("");

  await page.getByLabel("Command input").fill(command);
  await page.getByRole("button", { name: "Submit" }).click();
  let replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[1]?.innerHTML; // Extracting HTML table content
  });
  expect(replHistory).toContain(expectedResponse);

  // search it (brief)
  command = "search 0 this";
  let searchResultData = [["this"]];
  expectedResponse = searchResultData
    .map(
      (row, index) =>
        "<tr>" +
        row.map((cell, index) => "<td>" + cell + "</td>").join("") +
        "</tr>"
    )
    .join("");

  await page.getByLabel("Command input").fill(command);
  await page.getByRole("button", { name: "Submit" }).click();
  replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[2]?.innerHTML; // Extracting HTML table content
  });
  expect(replHistory).toContain(expectedResponse);

  // set verbose mode
  await page.getByLabel("Command input").fill("mode verbose");
  await page.getByRole("button", { name: "Submit" }).click();

  // view it
  command = "view";
  expectedResponse = data
    .map(
      (row, index) =>
        "<tr>" +
        row.map((cell, index) => "<td>" + cell + "</td>").join("") +
        "</tr>"
    )
    .join("");

  await page.getByLabel("Command input").fill(command);
  await page.getByRole("button", { name: "Submit" }).click();
  replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[4]?.innerHTML; // Extracting HTML table content
  });
  expect(replHistory).toContain(
    "<tr><td>Command: " +
      command +
      "</td></tr><tr><td>Output:</td></tr>" +
      "<table>" +
      expectedResponse +
      "<p></p></table>"
  );

  // search it
  command = "search 0 this";
  expectedResponse = searchResultData
    .map(
      (row, index) =>
        "<tr>" +
        row.map((cell, index) => "<td>" + cell + "</td>").join("") +
        "</tr>"
    )
    .join("");

  await page.getByLabel("Command input").fill(command);
  await page.getByRole("button", { name: "Submit" }).click();
  replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[5]?.innerHTML; // Extracting HTML table content
  });
  expect(replHistory).toContain(
    "<tr><td>Command: " +
      command +
      "</td></tr><tr><td>Output:</td></tr>" +
      "<table>" +
      expectedResponse +
      "<p></p></table>"
  );
});

/**
 * Test view and search (correct commands) with single row data.
 * Search results are empty. (BRIEF AND VERBOSE)
 */
test("after loading a single row csv, I can view & search it, in brief and verbose", async ({
  page,
}) => {
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").click();

  // load the csv
  await page.getByLabel("Command input").fill("load_file one_row.csv");
  await page.getByRole("button", { name: "Submit" }).click();

  // view it (brief)
  let command = "view";
  const data = [["a", "csv", "with", "one", "row!"]];
  let expectedResponse = data
    .map(
      (row, index) =>
        "<tr>" +
        row.map((cell, index) => "<td>" + cell + "</td>").join("") +
        "</tr>"
    )
    .join("");

  await page.getByLabel("Command input").fill(command);
  await page.getByRole("button", { name: "Submit" }).click();
  let replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[1]?.innerHTML; // Extracting HTML table content
  });
  expect(replHistory).toContain(expectedResponse);

  // search it (brief)
  command = "search 0 this";
  let searchResultData = [[]];
  expectedResponse = searchResultData
    .map(
      (row, index) =>
        "<tr>" +
        row.map((cell, index) => "<td>" + cell + "</td>").join("") +
        "</tr>"
    )
    .join("");

  await page.getByLabel("Command input").fill(command);
  await page.getByRole("button", { name: "Submit" }).click();
  replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[2]?.innerHTML; // Extracting HTML table content
  });
  expect(replHistory).toContain(expectedResponse);

  // set verbose mode
  await page.getByLabel("Command input").fill("mode verbose");
  await page.getByRole("button", { name: "Submit" }).click();

  // view it
  command = "view";
  expectedResponse = data
    .map(
      (row, index) =>
        "<tr>" +
        row.map((cell, index) => "<td>" + cell + "</td>").join("") +
        "</tr>"
    )
    .join("");

  await page.getByLabel("Command input").fill(command);
  await page.getByRole("button", { name: "Submit" }).click();
  replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[4]?.innerHTML; // Extracting HTML table content
  });
  expect(replHistory).toContain(
    "<tr><td>Command: " +
      command +
      "</td></tr><tr><td>Output:</td></tr>" +
      "<table>" +
      expectedResponse +
      "<p></p></table>"
  );

  // search it
  command = "search 0 this";
  expectedResponse = searchResultData
    .map(
      (row, index) =>
        "<tr>" +
        row.map((cell, index) => "<td>" + cell + "</td>").join("") +
        "</tr>"
    )
    .join("");

  await page.getByLabel("Command input").fill(command);
  await page.getByRole("button", { name: "Submit" }).click();
  replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[5]?.innerHTML; // Extracting HTML table content
  });
  expect(replHistory).toContain(
    "<tr><td>Command: " +
      command +
      "</td></tr><tr><td>Output:</td></tr>" +
      "<table>" +
      expectedResponse +
      "<p></p></table>"
  );
});

/**
 * Test load bad file then good file. (BRIEF)
 */
test("after attempting to load a nonexistent file, I can load a real one, in brief", async ({
  page,
}) => {
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").click();

  // nonexistent file
  let command = "load_file fake_filepath.csv";
  let data = [["Invalid filepath"]];
  let expectedResponse = data
    .map(
      (row, index) =>
        "<tr>" +
        row.map((cell, index) => "<td>" + cell + "</td>").join("") +
        "</tr>"
    )
    .join("");

  await page.getByLabel("Command input").fill(command);
  await page.getByRole("button", { name: "Submit" }).click();
  let replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[0]?.innerHTML; // Extracting HTML table content
  });
  expect(replHistory).toContain(expectedResponse);

  // attempt to load with wrong number args
  command = "load_file";
  data = [["Load formatting incorrect: load_file csv-file-path"]];
  expectedResponse = data
    .map(
      (row, index) =>
        "<tr>" +
        row.map((cell, index) => "<td>" + cell + "</td>").join("") +
        "</tr>"
    )
    .join("");
  await page.getByLabel("Command input").fill(command);
  await page.getByRole("button", { name: "Submit" }).click();
  replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[1]?.innerHTML; // Extracting HTML table content
  });
  expect(replHistory).toContain(expectedResponse);

  // good file
  command = "load_file numbers.csv";
  data = [["Successfully loaded CSV at numbers.csv"]];
  expectedResponse = data
    .map(
      (row, index) =>
        "<tr>" +
        row.map((cell, index) => "<td>" + cell + "</td>").join("") +
        "</tr>"
    )
    .join("");

  await page.getByLabel("Command input").fill(command);
  await page.getByRole("button", { name: "Submit" }).click();
  replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[2]?.innerHTML; // Extracting HTML table content
  });
  expect(replHistory).toContain(expectedResponse);
});

/**
 * Test load bad file then good file. (VERBOSE)
 */
test("after attempting to load a nonexistent file, I can load a real one, in verbose", async ({
  page,
}) => {
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").click();

  // set verbose mode
  await page.getByLabel("Command input").fill("mode verbose");
  await page.getByRole("button", { name: "Submit" }).click();

  // load nonexistent file
  let command = "load_file fake_filepath.csv";
  let data = [["Invalid filepath"]];
  let expectedResponse = data
    .map(
      (row, index) =>
        "<tr>" +
        row.map((cell, index) => "<td>" + cell + "</td>").join("") +
        "</tr>"
    )
    .join("");

  await page.getByLabel("Command input").fill(command);
  await page.getByRole("button", { name: "Submit" }).click();
  let replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[1]?.innerHTML; // Extracting HTML table content
  });
  expect(replHistory).toContain(
    "<tr><td>Command: " +
      command +
      "</td></tr><tr><td>Output:</td></tr>" +
      "<table>" +
      expectedResponse +
      "<p></p></table>"
  );

  // attempt to load with wrong number args
  command = "load_file";
  data = [["Load formatting incorrect: load_file csv-file-path"]];
  expectedResponse = data
    .map(
      (row, index) =>
        "<tr>" +
        row.map((cell, index) => "<td>" + cell + "</td>").join("") +
        "</tr>"
    )
    .join("");

  await page.getByLabel("Command input").fill(command);
  await page.getByRole("button", { name: "Submit" }).click();
  replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[2]?.innerHTML; // Extracting HTML table content
  });
  expect(replHistory).toContain(
    "<tr><td>Command: " +
      command +
      "</td></tr><tr><td>Output:</td></tr>" +
      "<table>" +
      expectedResponse +
      "<p></p></table>"
  );

  // load existing file
  command = "load_file numbers.csv";
  data = [["Successfully loaded CSV at numbers.csv"]];
  expectedResponse = data
    .map(
      (row, index) =>
        "<tr>" +
        row.map((cell, index) => "<td>" + cell + "</td>").join("") +
        "</tr>"
    )
    .join("");

  await page.getByLabel("Command input").fill(command);
  await page.getByRole("button", { name: "Submit" }).click();
  replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[3]?.innerHTML; // Extracting HTML table content
  });
  expect(replHistory).toContain(
    "<tr><td>Command: " +
      command +
      "</td></tr><tr><td>Output:</td></tr>" +
      "<table>" +
      expectedResponse +
      "<p></p></table>"
  );
});

/**
 * Test state interactions between load, view, search, and mode.
 * Load, search, view multiple files in a row. (BRIEF AND VERBOSE)
 */
test("I can load, view, search different files in one session", async ({
  page,
}) => {
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").click();

  // load file 1
  let command = "load_file numbers.csv";
  let data;
  let expectedResponse = [["Successfully loaded CSV at numbers.csv"]]
    .map(
      (row, index) =>
        "<tr>" +
        row.map((cell, index) => "<td>" + cell + "</td>").join("") +
        "</tr>"
    )
    .join("");

  await page.getByLabel("Command input").fill(command);
  await page.getByRole("button", { name: "Submit" }).click();
  let replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[0]?.innerHTML; // Extracting HTML table content
  });
  expect(replHistory).toContain(expectedResponse);

  // switch to verbose mode
  await page.getByLabel("Command input").fill("mode verbose");
  await page.getByRole("button", { name: "Submit" }).click();

  // view file 1
  command = "view";
  data = [
    [1, 2, 3, 4, 5],
    [5, 4, 3, 2, 1],
    [0, 1, 0, 1, 0],
  ];
  expectedResponse = data
    .map(
      (row, index) =>
        "<tr>" +
        row.map((cell, index) => "<td>" + cell + "</td>").join("") +
        "</tr>"
    )
    .join("");

  await page.getByLabel("Command input").fill(command);
  await page.getByRole("button", { name: "Submit" }).click();
  replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[2]?.innerHTML; // Extracting HTML table content
  });
  expect(replHistory).toContain(
    "<tr><td>Command: " +
      command +
      "</td></tr><tr><td>Output:</td></tr>" +
      "<table>" +
      expectedResponse +
      "<p></p></table>"
  );

  // search file 1
  command = "search 1 1";
  data = [[0, 1, 0, 1, 0]];
  expectedResponse = data
    .map(
      (row, index) =>
        "<tr>" +
        row.map((cell, index) => "<td>" + cell + "</td>").join("") +
        "</tr>"
    )
    .join("");

  await page.getByLabel("Command input").fill(command);
  await page.getByRole("button", { name: "Submit" }).click();
  replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[3]?.innerHTML; // Extracting HTML table content
  });
  expect(replHistory).toContain(
    "<tr><td>Command: " +
      command +
      "</td></tr><tr><td>Output:</td></tr>" +
      "<table>" +
      expectedResponse +
      "<p></p></table>"
  );

  // load new file (file 2)
  command = "load_file names_and_ages.csv";
  expectedResponse = [["Successfully loaded CSV at names_and_ages.csv"]]
    .map(
      (row, index) =>
        "<tr>" +
        row.map((cell, index) => "<td>" + cell + "</td>").join("") +
        "</tr>"
    )
    .join("");

  await page.getByLabel("Command input").fill(command);
  await page.getByRole("button", { name: "Submit" }).click();
  replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[4]?.innerHTML; // Extracting HTML table content
  });
  expect(replHistory).toContain(expectedResponse);

  // search file 2
  command = "search 0 Harry";
  data = [
    ["Harry", "Potter", "56"],
    ["Harry", "Harry", "12"],
  ];
  expectedResponse = data
    .map(
      (row, index) =>
        "<tr>" +
        row.map((cell, index) => "<td>" + cell + "</td>").join("") +
        "</tr>"
    )
    .join("");

  await page.getByLabel("Command input").fill(command);
  await page.getByRole("button", { name: "Submit" }).click();
  replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[5]?.innerHTML; // Extracting HTML table content
  });
  expect(replHistory).toContain(
    "<tr><td>Command: " +
      command +
      "</td></tr><tr><td>Output:</td></tr>" +
      "<table>" +
      expectedResponse +
      "<p></p></table>"
  );

  // switch back to brief mode
  await page.getByLabel("Command input").fill("mode brief");
  await page.getByRole("button", { name: "Submit" }).click();

  // view file 2
  command = "view";
  data = [
    ["first_name", "last_name", "age"],
    ["Harry", "Potter", "56"],
    ["Danny", "Fish", "23"],
    ["Harry", "Harry", "12"],
  ];
  expectedResponse = data
    .map(
      (row, index) =>
        "<tr>" +
        row.map((cell, index) => "<td>" + cell + "</td>").join("") +
        "</tr>"
    )
    .join("");

  await page.getByLabel("Command input").fill(command);
  await page.getByRole("button", { name: "Submit" }).click();
  replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[7]?.innerHTML; // Extracting HTML table content
  });
  expect(replHistory).toContain(expectedResponse);
});

/**
 * Test state interactions between load, search, and mode.
 * Search a file, switching mode several times. (BRIEF AND VERBOSE)
 */
test("I can search switching results between brief and verbose", async ({
  page,
}) => {
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").click();

  // switch to verbose mode
  await page.getByLabel("Command input").fill("mode verbose");
  await page.getByRole("button", { name: "Submit" }).click();

  // load file
  let command = "load_file income.csv";
  let data;
  let expectedResponse = [["Successfully loaded CSV at income.csv"]]
    .map(
      (row, index) =>
        "<tr>" +
        row.map((cell, index) => "<td>" + cell + "</td>").join("") +
        "</tr>"
    )
    .join("");

  await page.getByLabel("Command input").fill(command);
  await page.getByRole("button", { name: "Submit" }).click();
  let replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[1]?.innerHTML; // Extracting HTML table content
  });
  expect(replHistory).toContain(expectedResponse);

  // search file
  command = "search State RI";
  data = [
    ["RI", "White", "$1,058.47", "395773.6521", "$1.00", "75%"],
    ["RI", "Black", "$770.26", "30424.80376", "$0.73", "6%"],
    [
      "RI",
      "Native American/American Indian",
      "$471.07",
      "2315.505646",
      "$0.45",
      "0%",
    ],
    ["RI", "Asian-Pacific Islander", "$1,080.09", "18956.71657", "$1.02", "4%"],
    ["RI", "Hispanic/Latino", "$673.14", "74596.18851", "$0.64", "14%"],
    ["RI", "Multiracial", "$971.89", "8883.049171", "$0.92", "2%"],
  ];
  expectedResponse = data
    .map(
      (row, index) =>
        "<tr>" +
        row.map((cell, index) => "<td>" + cell + "</td>").join("") +
        "</tr>"
    )
    .join("");

  await page.getByLabel("Command input").fill(command);
  await page.getByRole("button", { name: "Submit" }).click();
  replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[2]?.innerHTML; // Extracting HTML table content
  });
  expect(replHistory).toContain(
    "<tr><td>Command: " +
      command +
      "</td></tr><tr><td>Output:</td></tr>" +
      "<table>" +
      expectedResponse +
      "<p></p></table>"
  );

  // switch back to brief mode
  await page.getByLabel("Command input").fill("mode brief");
  await page.getByRole("button", { name: "Submit" }).click();

  // search file (same search param)
  await page.getByLabel("Command input").fill(command);
  await page.getByRole("button", { name: "Submit" }).click();
  replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[4]?.innerHTML; // Extracting HTML table content
  });
  expect(replHistory).toContain(expectedResponse);

  // switch back to verbose mode
  await page.getByLabel("Command input").fill("mode verbose");
  await page.getByRole("button", { name: "Submit" }).click();

  // check previous search results are now in verbose
  replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[4]?.innerHTML; // Extracting HTML table content
  });
  expect(replHistory).toContain(
    "<tr><td>Command: " +
      command +
      "</td></tr><tr><td>Output:</td></tr>" +
      "<table>" +
      expectedResponse +
      "<p></p></table>"
  );
});

/**
 * Test incorrect calls to view before a correct view command.
 * Tests view with wrong number of arguments, viewing before loading. (BRIEF)
 */
test("Behavior when viewed with wrong number of arguments, viewed without loading, load successful file, and then view properly", async ({
  page,
}) => {
  // Wrong argument number for View
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").click();
  const command = "view Hi Everyone";
  const data = [["View formatting incorrect (expects no arguments): view"]];
  const expectedResponse = data
    .map(
      (row, index) =>
        "<tr>" +
        row.map((cell, index) => "<td>" + cell + "</td>").join("") +
        "</tr>"
    )
    .join("");
  await page.getByLabel("Command input").fill(command);
  await page.getByRole("button", { name: "Submit" }).click();
  let replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[0]?.innerHTML; // Extracting HTML table content
  });
  expect(replHistory).toContain(expectedResponse);

  // Attempt to View before Load
  await page.getByLabel("Command input").click();
  const command2 = "view";
  const data2 = [["Attempted to view CSV before loading CSV"]];
  const expectedResponse2 = data2
    .map(
      (row, index) =>
        "<tr>" +
        row.map((cell, index) => "<td>" + cell + "</td>").join("") +
        "</tr>"
    )
    .join("");
  await page.getByLabel("Command input").fill(command2);
  await page.getByRole("button", { name: "Submit" }).click();
  replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[1]?.innerHTML; // Extracting HTML table content
  });
  expect(replHistory).toContain(expectedResponse2);

  await page.getByLabel("Command input").click();
  const command3 = "load_file numbers.csv";
  const data3 = [["Successfully loaded CSV at numbers.csv"]];
  const expectedResponse3 = data3
    .map(
      (row, index) =>
        "<tr>" +
        row.map((cell, index) => "<td>" + cell + "</td>").join("") +
        "</tr>"
    )
    .join("");
  await page.getByLabel("Command input").fill(command3);
  await page.getByRole("button", { name: "Submit" }).click();
  replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[2]?.innerHTML; // Extracting HTML table content
  });
  expect(replHistory).toContain(expectedResponse3);

  await page.getByLabel("Command input").click();
  const command4 = "view";
  const data4 = [
    [1, 2, 3, 4, 5],
    [5, 4, 3, 2, 1],
    [0, 1, 0, 1, 0],
  ];
  const expectedResponse4 = data4
    .map(
      (row, index) =>
        "<tr>" +
        row.map((cell, index) => "<td>" + cell + "</td>").join("") +
        "</tr>"
    )
    .join("");
  await page.getByLabel("Command input").fill(command4);
  await page.getByRole("button", { name: "Submit" }).click();
  replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[3]?.innerHTML; // Extracting HTML table content
  });
  expect(replHistory).toContain(expectedResponse4);
});

/**
 * Test incorrect calls to search before a correct search command.
 * Tests search with wrong number of arguments, searching before loading. (BRIEF)
 */
test("Behavior when searched with wrong number of arguments, searched without loading, load successful file, and then search properly", async ({
  page,
}) => {
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").click();

  const command = "search 0 RI Wrong Arg";
  const data = [["Search formatting incorrect: search value column"]];
  const expectedResponse = data
    .map(
      (row, index) =>
        "<tr>" +
        row.map((cell, index) => "<td>" + cell + "</td>").join("") +
        "</tr>"
    )
    .join("");

  await page.getByLabel("Command input").fill(command);
  await page.getByRole("button", { name: "Submit" }).click();
  let replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[0]?.innerHTML; // Extracting HTML table content
  });
  expect(replHistory).toContain(expectedResponse);

  await page.getByLabel("Command input").click();
  const command2 = "search State RI";
  const data2 = [["Atempted to search CSV before loading CSV"]];
  const expectedResponse2 = data2
    .map(
      (row, index) =>
        "<tr>" +
        row.map((cell, index) => "<td>" + cell + "</td>").join("") +
        "</tr>"
    )
    .join("");
  await page.getByLabel("Command input").fill(command2);
  await page.getByRole("button", { name: "Submit" }).click();
  replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[1]?.innerHTML; // Extracting HTML table content
  });
  expect(replHistory).toContain(expectedResponse2);

  await page.getByLabel("Command input").click();
  const command3 = "load_file income.csv";
  const data3 = [["Successfully loaded CSV at income.csv"]];
  const expectedResponse3 = data3
    .map(
      (row, index) =>
        "<tr>" +
        row.map((cell, index) => "<td>" + cell + "</td>").join("") +
        "</tr>"
    )
    .join("");
  await page.getByLabel("Command input").fill(command3);
  await page.getByRole("button", { name: "Submit" }).click();
  replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[2]?.innerHTML; // Extracting HTML table content
  });
  expect(replHistory).toContain(expectedResponse3);

  await page.getByLabel("Command input").click();
  const command4 = "search State RI";
  const data4 = [
    ["RI", "White", "$1,058.47", "395773.6521", "$1.00", "75%"],
    ["RI", "Black", "$770.26", "30424.80376", "$0.73", "6%"],
    [
      "RI",
      "Native American/American Indian",
      "$471.07",
      "2315.505646",
      "$0.45",
      "0%",
    ],
    ["RI", "Asian-Pacific Islander", "$1,080.09", "18956.71657", "$1.02", "4%"],
    ["RI", "Hispanic/Latino", "$673.14", "74596.18851", "$0.64", "14%"],
    ["RI", "Multiracial", "$971.89", "8883.049171", "$0.92", "2%"],
  ];
  const expectedResponse4 = data4
    .map(
      (row, index) =>
        "<tr>" +
        row.map((cell, index) => "<td>" + cell + "</td>").join("") +
        "</tr>"
    )
    .join("");
  await page.getByLabel("Command input").fill(command4);
  await page.getByRole("button", { name: "Submit" }).click();
  replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[3]?.innerHTML; // Extracting HTML table content
  });
  expect(replHistory).toContain(expectedResponse4);
});

/**
 * Test incorrect calls to mode before a correct mode command.
 * Tests mode with wrong number of arguments, wrong arguments.
 */
test("Behavior when switching mode with wrong number of arguments, wrong arguments, and then calls mode properly", async ({
  page,
}) => {
  // Wrong argument number for mode
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").click();
  const command = "mode";
  const data = [["Wrong number of arguments provided: mode brief OR verbose"]];
  const expectedResponse = data
    .map(
      (row, index) =>
        "<tr>" +
        row.map((cell, index) => "<td>" + cell + "</td>").join("") +
        "</tr>"
    )
    .join("");
  await page.getByLabel("Command input").fill(command);
  await page.getByRole("button", { name: "Submit" }).click();
  let replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[0]?.innerHTML; // Extracting HTML table content
  });
  expect(replHistory).toContain(expectedResponse);

  // mode with wrong argument
  await page.getByLabel("Command input").click();
  const command2 = "mode party_mode";
  const data2 = [["Wrong argument provided to mode: mode brief OR verbose"]];
  const expectedResponse2 = data2
    .map(
      (row, index) =>
        "<tr>" +
        row.map((cell, index) => "<td>" + cell + "</td>").join("") +
        "</tr>"
    )
    .join("");
  await page.getByLabel("Command input").fill(command2);
  await page.getByRole("button", { name: "Submit" }).click();
  replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[1]?.innerHTML; // Extracting HTML table content
  });
  expect(replHistory).toContain(expectedResponse2);

  // correct mode switch (brief -> verbose)
  await page.getByLabel("Command input").click();
  const command3 = "mode verbose";
  const data3 = [["Mode set to verbose"]];
  const expectedResponse3 = data3
    .map(
      (row, index) =>
        "<tr>" +
        row.map((cell, index) => "<td>" + cell + "</td>").join("") +
        "</tr>"
    )
    .join("");
  await page.getByLabel("Command input").fill(command3);
  await page.getByRole("button", { name: "Submit" }).click();
  replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[2]?.innerHTML; // Extracting HTML table content
  });
  expect(replHistory).toContain(
    "<tr><td>Command: " +
      command3 +
      "</td></tr><tr><td>Output:</td></tr>" +
      "<table>" +
      expectedResponse3 +
      "<p></p></table>"
  );
});

/**
 * Test calling mode to switch to current mode. (redundant)
 */
test("Behavior when switching mode to current mode", async ({ page }) => {
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").click();

  // (in brief mode already as dflt)

  // try to switch to brief mode again
  let command = "mode brief";
  let data = [["Mode set to brief"]];
  let expectedResponse = data
    .map(
      (row, index) =>
        "<tr>" +
        row.map((cell, index) => "<td>" + cell + "</td>").join("") +
        "</tr>"
    )
    .join("");
  await page.getByLabel("Command input").fill(command);
  await page.getByRole("button", { name: "Submit" }).click();
  let replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[0]?.innerHTML; // Extracting HTML table content
  });
  expect(replHistory).toContain(expectedResponse);

  // try to switch to brief mode... again
  await page.getByLabel("Command input").fill(command);
  await page.getByRole("button", { name: "Submit" }).click();
  replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[1]?.innerHTML; // Extracting HTML table content
  });
  expect(replHistory).toContain(expectedResponse);

  // switch to verbose
  command = "mode verbose";
  data = [["Mode set to verbose"]];
  expectedResponse = data
    .map(
      (row, index) =>
        "<tr>" +
        row.map((cell, index) => "<td>" + cell + "</td>").join("") +
        "</tr>"
    )
    .join("");
  await page.getByLabel("Command input").fill(command);
  await page.getByRole("button", { name: "Submit" }).click();
  replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[2]?.innerHTML; // Extracting HTML table content
  });
  expect(replHistory).toContain(
    "<tr><td>Command: " +
      command +
      "</td></tr><tr><td>Output:</td></tr>" +
      "<table>" +
      expectedResponse +
      "<p></p></table>"
  );

  // try to switch to verbose again
  await page.getByLabel("Command input").fill(command);
  await page.getByRole("button", { name: "Submit" }).click();
  replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[3]?.innerHTML; // Extracting HTML table content
  });
  expect(replHistory).toContain(
    "<tr><td>Command: " +
      command +
      "</td></tr><tr><td>Output:</td></tr>" +
      "<table>" +
      expectedResponse +
      "<p></p></table>"
  );
});

/**
 * Test that malformed CSV cannot be loaded. (BRIEF)
 */
test("after trying to load malformed CSV, we get an error message", async ({
  page,
}) => {
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").click();

  let command = "load_file malformed.csv";
  let data = [["Malformed CSV. Unable to handle this file."]];
  let expectedResponse = data
    .map(
      (row, index) =>
        "<tr>" +
        row.map((cell, index) => "<td>" + cell + "</td>").join("") +
        "</tr>"
    )
    .join("");
  await page.getByLabel("Command input").fill(command);
  await page.getByRole("button", { name: "Submit" }).click();
  let replHistory = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[0]?.innerHTML; // Extracting HTML table content
  });
  expect(replHistory).toContain(expectedResponse);
});
