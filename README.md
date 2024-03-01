# Project Details

**Mock**

**CS Logins:** abousque, hchung33

**Total Estimated Time:** ~18 hours

**Github Link:** https://github.com/cs0320-s24/mock-hchung33-abousque

# Design Choices

## High level Overview

The three main files that handle REPL functionality include REPL, REPLHistory, and REPLInput.

In REPL, there are useState variables history and brief, which can be modified with setHistory and setBrief. These data structures keep track of the history of what commands a user has inputted and the corresponding output, and mode in which this history should be displayed (either brief or not-brief/verbose), respectively. Both history and brief are passed to REPLHistory and REPLHistory to create these shared states for translating between input and output (history).

In REPLHistory, we include the array of past commands and the state of display between brief mode and verbose mode. Within the export function REPLHistory, there are two helper, sub-functions: outputHTML and verboseHTML. In ouputHTML, which is the final output for brief mode, we take each array from the history shared state and create a descriptive HTML table of the output from each command. This function is also used in verboseHTML, which prepends the result of the outputHTML with additional HTML-formatted information indicating the command that produced the corresponding output and a label for this output. In REPLHistory's export function, we check the current state (using our useState: brief) and return the appropriate result for the user to view using one of these functions.

In REPLInput, we use the interface REPLInputProps to keep track of our shared history and brief states, as well as their corresponding setters: setHistory and setBrief. REPLInput uses nested functions each implementing the REPLFunction interface to execute different user commands (user story 6). Our modified REPLFunction interface takes in an Array<string> of arguments to the user-inputted command and returns a 2D Array of strings containing the output of executing the REPLFunction's corresponding command with the arguments provided. This ensures that the code is extensible for any external developers to add or 'register' new REPLFunctions for handling additional commands without having to modify any more of the program. The existing REPLFunctions we 'registered' for this base model of the program are setMode (sets brief or verbose mode for displaying history), loadCSV (loads a CSV from filepath, mocked for now), viewCSV (views the previously loaded CSV, mocked for now), and searchCSV (searches for a target in the previously loaded CSV, mocked for now).

setMode checks if the inputted args is of valid length (because we only process the args following "mode", the length should be 1), check if the value is "brief" or "verbose", and adjust the brief value appropriately with props.setBrief and return the 2D Array of string indicating output.

<!--
wondering if this is unnecessary detail for our "high level design of this program" in this section of the README?

loadCSV checks if the user has appropriately inputted a csv file path after "load_file" command, and either return the output by calling mockedLoadCsv or an error message about the wrong formatting. Read below for further information on mockedLoadCsv, mockedViewCsv, and mockedSearchCsv.

viewCSV also checks if the formatting of the command is valid, and return the result from mockedViewCsv or an appropriate error message.

searchCSV also checks if the formatting of the command is valid, and return the result from mockedSearchCsv or an appropriate error message. -->

Our CSV-related REPLFunctions use currently mocked functionality based on mocked functions mockedLoadCsv, mockedViewCsv, and mockedSearchCsv, that live in src/mockedBackend/csvActions.tsx.CsvActions serves as a mocked backend of this program until we integrate with the backend Java code. It keeps track of mocked data from data/mockedJson.ts, Maps fake filepaths to this mocked data and to example search results, and leverages useState from React to keep track of current 'loaded' CSV and its associated fake filepath.

<!--
Wondering if this is also unnecessary detail?

mockedLoadCsv checks if the filepath is within the Map of mocked responses, and if it is, then it sets current CSV path and current CSV to the new filepath, and returns a success message. If the filepath is not mocked, it returns an error message "Invalid filepath." To also mock the behavior of a malformed CSV, we return an error message that the file is malformed if it is "malformed.csv".

mockedViewCsv checks if currentCSVPath and currentCSV is undefined, and if so, it returns an error message. Otherwise, it creates a table of the currentCSV and returns as output.

mockedSearchCSV checks if currentCSVPath and currentCSV is undefined, and if so, it returns an error message. Otherwise, it retrieves the mocked search result from the Map, and if there is any unforseen error (result being undefined), it returns an error message. Otherwise, it creates a table of the result and returns as output.

mockedJson file contains all of the mocked data 2D arrays. -->

## Specific Data-Related Design Choices made

Here are some of the specific design choices we made throughout the project regarding data structures and displaying data:

1. We adjusted the position of text to be shifted left rather than centered on the display (modified App.css) to ensure readable and easily interpretable HTML tables in the repl-history display.
2. We added newlines between command outputs in the terminal for readability and clear distinctions between the results of one command and the next.
3. The order of our repl-history output for a single command in verbose is "Command: <command>", newline, "Output:", newline, and then actual <output>. This deviated from the user story 1 description in output display, but we justify the change because it made our code the smoothest for displaying data results and error messages the same way while not affecting user interpretability because the newline between command outputs makes it so a user should still be able to easily see what output corresponds to a given output label.
4. We changed REPLFunction to return a definitive string[][] rather than a string | string[][] because it made our code for displaying to history a lot cleaner and more flexible since it didn't need to make any distinction between displaying messages or data. Although this means an extra step in returning error messages from REPLFunctions, we feel it is not unreasonably difficult to wrap a string message in a string[][] and our javadoc for REPLFunction specifies and elaborates this change so that user story 6 is still clearly met.
5. We chose to represent the history shared state as a string[][][][]. While this may seem like an overwhelmingly complex data type, it really isn't. This translates to history being a list of command-output tuples where each command and corresponding output are 2D arrays of strings to encase 2D arrays of CSV data. In rough pseudotypes, this looks like history: command-output-pairs[] where a command-output-pair: [command: string[][], correspondingOutput: string[][]]. Further, this data type is abstracted from all end users, including other developers represented in user story 6, so as long as we as the front-end developers understand it, all is well.

# Errors/Bugs

There are no undiscovered bugs to our knowledge in our program.

# Tests

Because of the design of our CsvActions, which limits any access to individual mocked methods, we thoroughly tested all functionality in the e2e testing folder. Please see our ed post #351 for more explanation on why we could not run isolated unit tests of REPLFunctions.

In terms of e2e testing, we focused on asserting that states of the program interacted with user commands as expected and that commands resulting in an error did not affect future states/command outputs.

Here is a non-exhaustive list demonstrating tests we wrote. For some cases, we combined tests to test functionality with different states, toggling between brief and verbose mode. Please see the javadocs in our tests/e2e/App.spec.ts file for individual tests to see how each test ensures a specific part of the program works as intended.

- can't enter text without hitting login
- can't sign out then enter text
- entering nothing
- entering whitespace
- entering nonexistent command
- load success
- view success
- search success
- wrong load then correct load
- wrong view then correct view
- wrong search then correct search
- load then view then load then view
- load then search then load then search
- load then view then search then load then view
- mode with wrong number args
- load with wrong number args
- view with wrong number args
- search with wrong number args
- view before load
- search before load
- load with data not available
- output of mode verbose
- output of mode brief
- load then verbose then view
- load then search then verbose then search then brief then search
- search where result is empty
- search where result is 1 row and/or 1 col
- search where result is many rows/cols
- view with many rows/cols
- view with one row
- view with one col
- view numbers
- view strings
- log in, type valid command, log out, check that history is empty (can't see data from previous session)
- log in, type valid command, log out, log in, view (CSV data does not remain loaded from previous session)
- search with column in number, column in string

# How to

## Run Tests

In a terminal run:

1. cd mock
2. npm install
3. npm test

A summary of the testing results will automatically open in your browser after all 99 tests have been run.

## Run the Mock Terminal

In a terminal run:

1. cd mock
2. npm install
3. npm start
4. open the link displayed in the npm start output
5. interact with and use the mock terminal!

If you encounter errors, ensure that you are using the correct npm version (Node.js version 20.11.1).

# Collaboration

We conceptually discussed ways to share the brief vs. verbose state between REPLInput and REPLHistory with @...?
