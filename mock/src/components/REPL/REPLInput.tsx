import { Dispatch, SetStateAction, useState } from "react";
import "../../styles/main.css";
import { ControlledInput } from "../ControlledInput";
import { csvActions } from "../../mockedBackend/CsvActions";

/**
 * This is the REPLInputProps, which contains history and brief, and respective
 * setHistory and setBrief. Mode switch occures with the boolean value of brief.
 */
interface REPLInputProps {
  history: string[][][][];
  setHistory: Dispatch<SetStateAction<string[][][][]>>;
  brief: boolean;
  setBrief: Dispatch<SetStateAction<boolean>>;
}

/**
 * A command-processor function for our REPL.
 * All functions intended for use with this front end should comply with the
 * following specifications.
 *
 * @param args an array of strings where each string is an argument following
 * the command inputted by a user (e.g. if the user inputted "search this that",
 * args would be ["this", "that"])
 * @returns a string[][], the output data to display to the user, which can be
 * a 2D array of string data, or in the case of an error message that message
 * wrapped in a 2D array
 */
export interface REPLFunction {
  (args: Array<string>): string[][];
}

/**
 * Main function for REPLInput that parses the user's input command and calls
 * the appropriate REPLFunction to handle the command using a Map
 *
 * @param props REPLInputProps
 * @returns returns a HTML object that handles command input
 */
export function REPLInput(props: REPLInputProps) {
  const [commandString, setCommandString] = useState<string>("");
  const { mockedLoadCsv, mockedViewCsv, mockedSearchCsv } = csvActions();

  /**
   * REPLFunction for setting mode.
   *
   * @param args a list of the arguments provided by the user following their command
   * @returns a string[][] the output of executing the mode command with args
   */
  let setMode: REPLFunction;
  setMode = function (args: Array<string>): string[][] {
    let output;
    if (args.length === 1) {
      if (args[0] === "brief") {
        props.setBrief(true);
        output = [["Mode set to brief"]];
      } else if (args[0] === "verbose") {
        props.setBrief(false);
        output = [["Mode set to verbose"]];
      } else {
        output = [["Wrong argument provided to mode: mode brief OR verbose"]];
      }
    } else {
      output = [["Wrong number of arguments provided: mode brief OR verbose"]];
    }
    return output;
  };

  /**
   * REPLFunction for loading csv.
   *
   * @param args a list of the arguments provided by the user following their command
   * @returns a string[][] the output of executing the load_file command with args
   */
  let loadCSV: REPLFunction;
  loadCSV = function (args: Array<string>): string[][] {
    if (args.length === 1) {
      return mockedLoadCsv(args[0]);
    } else {
      return [["Load formatting incorrect: load_file csv-file-path"]];
    }
  };

  /**
   * REPLFunction for viewing csv.
   *
   * @param args a list of the arguments provided by the user following their command
   * @returns a string[][] the output of executing the view command with args
   */
  let viewCSV: REPLFunction;
  viewCSV = function (args: Array<string>): string[][] {
    if (args.length === 0) {
      return mockedViewCsv();
    } else {
      return [["View formatting incorrect (expects no arguments): view"]];
    }
  };

  /**
   * REPLFunction for searching csv.
   *
   * @param args a list of the arguments provided by the user following their command
   * @returns a string[][] the output of executing the search command with args
   */
  let searchCSV: REPLFunction;
  searchCSV = function (args: Array<string>): string[][] {
    if (args.length === 2 || args.length === 3) {
      return mockedSearchCsv(args[0], args[1]);
    } else {
      return [["Search formatting incorrect: search value column"]];
    }
  };

  // Map that allows the program to look up REPLFunction from command
  var commandFunctions: { [cmd: string]: REPLFunction } = {
    mode: setMode,
    load_file: loadCSV,
    view: viewCSV,
    search: searchCSV,
  };

  /**
   * Handler for Submit button. Error checks and executes valid user command.
   *
   * @param commandString the user inputted string detailing their command
   */
  function handleSubmit(commandString: string) {
    if (commandString.trim() === "") {
      // do nothing if user entered only whitespace
      return;
    }
    const args = commandString.split(" ");
    const command: string = args[0];
    args.shift();

    // If command does not exist in Map, returns an error message
    if (!(command in commandFunctions)) {
      props.setHistory([
        ...props.history,
        [[[commandString]], [["Entered unrecognized command"]]],
      ]);
      setCommandString("");
      return;
    }

    // Retrieves the appropriate REPLFunction
    const appropriateHandler: REPLFunction = commandFunctions[command];

    let output: string[][] = appropriateHandler(args);
    // Adds to REPLHistory
    props.setHistory([...props.history, [[[commandString]], output]]);
    setCommandString("");
  }

  return (
    <div className="repl-input">
      <fieldset>
        <legend>Enter a command:</legend>
        <ControlledInput
          value={commandString}
          setValue={setCommandString}
          ariaLabel={"Command input"}
        />
      </fieldset>
      <button onClick={() => handleSubmit(commandString)}>Submit</button>
    </div>
  );
}
