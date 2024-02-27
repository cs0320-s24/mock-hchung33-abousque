import { Dispatch, SetStateAction, useState } from "react";
import "../styles/main.css";
import { ControlledInput } from "./ControlledInput";
import { csvActions } from "../mockedBackend/csvActions";

interface REPLInputProps {
  // TODO: Fill this with desired props... Maybe something to keep track of the submitted commands
  // CHANGED
  history: string[][][][];
  setHistory: Dispatch<SetStateAction<string[][][][]>>;
  brief: boolean;
  setBrief: Dispatch<SetStateAction<boolean>>;
}

/**
 * A command-processor function for our REPL.
 * The function takes an array of string arguments and does not return anything.
 * REPLFunctions send their results directly to REPLHistory to display.
 */
export interface REPLFunction {
  (args: Array<string>): void;
}

export function REPLInput(props: REPLInputProps) {
  const [commandString, setCommandString] = useState<string>("");
  const [count, setCount] = useState<number>(0);
  const [briefMode, setBriefMode] = useState<boolean>(true);
  const {mockedLoadCsv, mockedViewCsv, mockedSearchCsv} = csvActions();


  /**
   * REPLFunction for setting mode.
   */
  let setMode: REPLFunction;
  setMode = function (args: Array<string>): string[][] {
    let briefMode;
    let output;
    if (args.length === 1) {
      if (args[0] === "brief"){
        // briefMode = true;
        props.setBrief(true);
        output = [["Mode set to brief"]];
      } else if (args[0] === "verbose") {
        // briefMode = false;
        props.setBrief(false);
        output = [["Mode set to verbose"]];
      } else {
        // briefMode = props.brief;
        output = [["Wrong argument provided to mode: mode <brief OR verbose>"]];
      }
    } else {
      // briefMode= props.brief;
      output = [["Wrong number of arguments provided: mode <brief OR verbose>"]];
    }
    // props.setBrief(briefMode);
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
      rawOutput = [["Indicate CSV file path: load_file <csv-file-path>"]];
    }
    if (briefMode) {
      formattedOutput = rawOutput;
    } else {
      formattedOutput = [["Command: " + args[0] + " " + args[1]]]
        .concat([["Output: "]])
        .concat(rawOutput);
    }
    props.setHistory([...props.history, formattedOutput]);
  };

  /**
   * REPLFunction for viewing csv.
   */
  let viewCSV: REPLFunction;
  viewCSV = function (args: Array<string>): string[][] {
    if (args.length === 0) {
      return mockedViewCsv();

    } else {
      formattedOutput = [[["Command: " + args[0]]]]
        .concat([[["Output: "]]])
        .concat([rawOutput]);
    }
    props.setHistory([...props.history].concat(formattedOutput));
  };

  /**
   * REPLFunction handler for searching a loaded CSV.
   */
  let searchCSV: REPLFunction;

  searchCSV = function (args: Array<string>): string[][] {
    if (args.length === 2 || args.length === 3) {
      return mockedSearchCsv(args[0], args[1]);

    } else {
      formattedOutput = [
        [["Command: " + args[0] + " " + args[1] + " " + args[2]]],
      ]
        .concat([[["Output: "]]])
        .concat([rawOutput]);
    }
    props.setHistory([...props.history].concat(formattedOutput));
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
      // props.setHistory([...props.history, [["Entered unrecognized command"]]]);
      setCommandString("");
      return;
    }

    const appropriateHandler: REPLFunction = commandFunctions[command];


    let output: string[][] = appropriateHandler(args);
    props.setHistory([...props.history, [[[commandString]], output]]);
    // props.setHistory([...props.history].concat([[[commandString]], output]));
    

    setCommandString("");
  }

  /**
   * We suggest breaking down this component into smaller components, think about the individual pieces
   * of the REPL and how they connect to each other...
   */
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

      {/* TODO: Currently this button just counts up, can we make it push the contents of the input box to the history?*/}
      <button onClick={() => handleSubmit(commandString)}>
        Submit
      </button>

    </div>
  );
}
