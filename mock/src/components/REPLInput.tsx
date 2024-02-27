import { Dispatch, SetStateAction, useState } from "react";
import "../styles/main.css";
import { ControlledInput } from "./ControlledInput";
import { csvActions } from "../mockedBackend/csvActions";

interface REPLInputProps {
  history: string[][][][];
  setHistory: Dispatch<SetStateAction<string[][][][]>>;
  brief: boolean;
  setBrief: Dispatch<SetStateAction<boolean>>;
}

/**
 * A command-processor function for our REPL. The function returns a string, which is the value to print to history when
 * the command is done executing.
 *
 * The arguments passed in the input (which need not be named "args") should
 * *NOT* contain the command-name prefix.
 */
export interface REPLFunction {
  (args: Array<string>): string[][];
}

export function REPLInput(props: REPLInputProps) {
  const [commandString, setCommandString] = useState<string>("");
  const [count, setCount] = useState<number>(0);
  const [briefMode, setBriefMode] = useState<boolean>(true);
  const { mockedLoadCsv, mockedViewCsv, mockedSearchCsv } = csvActions();

  /**
   * REPLFunction for setting mode.
   */
  let setMode: REPLFunction;
  setMode = function (args: Array<string>): string[][] {
    let briefMode;
    let output;
    if (args.length === 1) {
      if (args[0] === "brief") {
        props.setBrief(true);
        output = [["Mode set to brief"]];
      } else if (args[0] === "verbose") {
        props.setBrief(false);
        output = [["Mode set to verbose"]];
      } else {
        output = [["Wrong argument provided to mode: mode <brief OR verbose>"]];
      }
    } else {
      output = [
        ["Wrong number of arguments provided: mode <brief OR verbose>"],
      ];
    }
    return output;
  };

  /**
   * REPLFunction for loading csv.
   */
  let loadCSV: REPLFunction;
  loadCSV = function (args: Array<string>): string[][] {
    if (args.length === 1) {
      return mockedLoadCsv(args[0]);
    } else {
      return [["Indicate CSV file path: load_file <csv-file-path>"]];
    }
  };

  /**
   * REPLFunction for viewing csv.
   */
  let viewCSV: REPLFunction;
  viewCSV = function (args: Array<string>): string[][] {
    if (args.length === 0) {
      return mockedViewCsv();
    } else {
      return [["viewcsv expects no arguments: view"]];
    }
  };

  /**
   * REPLFunction for searching csv.
   */
  let searchCSV: REPLFunction;
  searchCSV = function (args: Array<string>): string[][] {
    if (args.length === 2 || args.length === 3) {
      return mockedSearchCsv(args[0], args[1]);
    } else {
      return [["Search formatting incorrect: search <value> <column>"]];
    }
  };

  // map lookup to function for cmd
  var commandFunctions: { [cmd: string]: REPLFunction } = {
    mode: setMode,
    load_file: loadCSV,
    view: viewCSV,
    search: searchCSV,
  };

  /**
   * Handler for Submit button. Error checks and executes valid user command.
   */
  function handleSubmit(commandString: string) {
    const args = commandString.split(" ");
    const command: string = args[0];
    args.shift();

    if (!(command in commandFunctions)) {
      props.setHistory([...props.history, [[[commandString]], [["Entered unrecognized command"]]]]);
      setCommandString("");
      return;
    }

    const appropriateHandler: REPLFunction = commandFunctions[command];

    let output: string[][] = appropriateHandler(args);
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
