import { Dispatch, SetStateAction, useState} from "react";
import "../styles/main.css";
import { ControlledInput } from "./ControlledInput";
import { csvActions } from "../mockedBackend/csvActions";


interface REPLInputProps {
  history: string[][][];
  setHistory: Dispatch<SetStateAction<string[][][]>>;
}

/**
 * A command-processor function for our REPL. 
 * The function takes an array of string arguments and does not return anything. 
 * REPLFunctions send their results directly to REPLHistory to display.
 */
export interface REPLFunction {
  (args: Array<string>) : void;
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
  setMode = function (args: Array<string>) {
    let output: string[][];
    if (args.length === 2) {
      if (args[1] === "brief") {
        setBriefMode(true);
        output = [["Mode set to brief"]];
      } else if (args[1] === "verbose") {
        setBriefMode(false);
        output = [["Command: " + args[0] + " " + args[1]]].concat([["Output: Mode set to verbose"]]);
      } else {
        output = [["Wrong argument provided to mode: mode <brief OR verbose>"]];
      }
    } else {
      if (briefMode) {
        output = [["Wrong number of arguments provided: mode <brief OR verbose>"]];
      } else {
        output = [["Command: " + args[0] + " " + args[1]]].concat([["Wrong number of arguments provided: mode <brief OR verbose>"]]);
      }
    }
    props.setHistory([...props.history, output]);
  };

  /**
   * REPLFunction for loading csv.
   */
  let loadCSV: REPLFunction;
  loadCSV = function (args: Array<string>) {
    let rawOutput: string[][];
    let formattedOutput: string[][];
    if (args.length === 2) {
      rawOutput = mockedLoadCsv(args[1]);    
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
  viewCSV = function (args: Array<string>) {
    let rawOutput: string[][];
    let formattedOutput: string[][];
    if (args.length === 1) {
      rawOutput = mockedViewCsv();    
    } else {
      rawOutput = [["viewcsv expects no arguments: view"]];
    }
    if (briefMode) {
      formattedOutput = rawOutput; 
    } else {
      formattedOutput = [["Command: " + args[0]]]
        .concat([["Output: "]])
        .concat(rawOutput);
    }
    props.setHistory([...props.history, formattedOutput]);
  };

  /**
   * REPLFunction handler for searching a loaded CSV.
   */
  let searchCSV: REPLFunction;
  searchCSV = function (args: Array<string>) {
    let rawOutput: string[][];
    let formattedOutput: string[][];
    if (args.length === 3) {
      rawOutput = mockedSearchCsv(args[1], args[2]);  
    } else {
      rawOutput = [["Search formatting incorrect: search <column> <value>"]];
    }
    if (briefMode) {
      formattedOutput = rawOutput; 
    } else {
      formattedOutput = [["Command: " + args[0] + " " + args[1] + " " + args[2]]]
        .concat([["Output: "]])
        .concat(rawOutput);
    }
    props.setHistory([...props.history, formattedOutput]);
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
    if (args.length === 0) {
      // nothing entered
      return;
    }
    const command: string = args[0].trim();

    if (!(command in commandFunctions)) {
      props.setHistory([...props.history, [["Entered unrecognized command"]]]);
      setCommandString("");
      return;
    }

    const appropriateHandler: REPLFunction = commandFunctions[command];
    appropriateHandler(args);
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
      <button onClick={() => handleSubmit(commandString)}>
        Submit
      </button>
    </div>
  );
}
