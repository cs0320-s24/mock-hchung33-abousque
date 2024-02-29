> **GETTING STARTED:** You should likely start with the `/mock` folder from your solution code for the mock gearup.

# Project Details

This is our Mock. The three main files that handle REPL functionality include REPL, REPLHistory, and REPLInput. 

In REPL, there is a useState variable history and brief, which can be modified with setHistory and setBrief. Then, both history and brief gets passed into REPLHistory and REPLHistory for sending outputs to the history and adjusting the formatting of the brief mode and verbose mode.

In REPLHistory, we include the array of past commands and the state of display between brief mode and verbose mode. Within the export function REPLHistory, there are two sub-functions: outputHTML and verboseHTML. In ouputHTML, which is the final output for brief mode, we get the command (input and output from REPLInput) and create a HTML table from it. This function is also used in verboseHTML, which is the result of the outputHTML added with the additional information indicating the command that produced the output. Then, using these functions, we check the current state (using useState brief) and return the appropriate result for the user to view.

In REPLInput, we keep track of history, setHistory, brief, and setBrief in REPLInputProps. In order to fulfill user story 6, we implement export interface REPLFunction, which takes in Array<string> as argument and returns a 2D Array of string. This ensures that the code is extensible for any external developers to add new functions. 

Within REPLInput, there are functions setMode, loadCSV, viewCSV, and searchCSV. 

setMode checks if the inputted args is of valid length (because we only process the args following "mode", the length should be 1), check if the value is "brief" or "verbose", and adjust the brief value appropriately with props.setBrief and return the 2D Array of string indicating output. 

loadCSV checks if the user has appropriately inputted a csv file path after "load_file" command, and either return the output by calling mockedLoadCsv or an error message about the wrong formatting. Read below for further information on mockedLoadCsv, mockedViewCsv, and mockedSearchCsv.

viewCSV also checks if the formatting of the command is valid, and return the result from mockedViewCsv or an appropriate error message. 

searchCSV also checks if the formatting of the command is valid, and return the result from mockedSearchCsv or an appropriate error message.

To access mockedLoadCsv, mockedViewCsv, and mockedSearchCsv, navigate to mockedBackend folder and access CsvActions. CsvActions serves as a mocked backend of this program. It keeps track of mocked data (NOTE: this is accessible in mockedJson in data folder), Maps from filepath to data and filepath to search result, and useState for current CSV and CSV file path. 

mockedLoadCsv checks if the filepath is within the Map of mocked responses, and if it is, then it sets current CSV path and current CSV to the new filepath, and returns a success message. If the filepath is not mocked, it returns an error message "Invalid filepath." To also mock the behavior of a malformed CSV, we return an error message that the file is malformed if it is "malformed.csv".

mockedViewCsv checks if currentCSVPath and currentCSV is undefined, and if so, it returns an error message. Otherwise, it creates a table of the currentCSV and returns as output.

mockedSearchCSV checks if currentCSVPath and currentCSV is undefined, and if so, it returns an error message. Otherwise, it retrieves the mocked search result from the Map, and if there is any unforseen error (result being undefined), it returns an error message. Otherwise, it creates a table of the result and returns as output. 

mockedJson file contains all of the mocked data 2D arrays.

# Design Choices

Here are some of the design choices we made throughout the project:
- Adjusted the position of the Mock outputs to be shifted to the left
- Added newlines between command outputs in terminal for readability
- The order of output is output label, a new line, and then actual output, because it made our code the smoothest for displaying data results and error messages the same way. We justify this change as not affecting user interpretability because of the newline between command outputs (user should still be able to easily see what output corresponds to a given output label)
- changed REPLFunction to return a definitive string[][] rather than a string | string[][] because it made our code for displaying to history a lot cleaner, and it is not hard to wrap a string message in a string[][]. Our javadocs specify and elaborate this change so that user story 6 is still met.

# Errors/Bugs

# Tests

Because of the design of our CsvActions, which limits any access to individual mocked methods, we thoroughly tested all functionality in the e2e testing folder. 

Here is a non-exhaustive list demonstrating tests we wrote. For some cases, we combined the tests in order and toggled between brief and verbose mode.


 * E2E
 - an't enter text without hitting login
 - can you logout then enter text
 - entering nothing
 - entering spaces
 - entering nonexistent command
 - load correct
 - view correct
 - search correct
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
 - search where result is 1 row
 - search where result is many rows
 - view with many rows/cols
 - view with one row
 - view with one col
 - view numbers
 - view strings
 - log in, type valid command, log out, check that box is empty
 - log in, type valid command, log out, log in, view (fails)
 - search with column in number, column in string
 

# How to

In order to run, type "npm start" to the terminal and ensure that you are using the correct npm version (Node.js version 20.11.1).

# Collaboration
*(state all of your sources of collaboration past your project partner. Please refer to the course's collaboration policy for any further questions.)*
