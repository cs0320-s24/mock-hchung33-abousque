import { Dispatch, SetStateAction, useState} from "react";
import "../styles/main.css";
import { ControlledInput } from "./ControlledInput";
import { csvActions } from "../mockedBackend/csvActions";


interface REPLInputProps {
  // TODO: Fill this with desired props... Maybe something to keep track of the submitted commands
  // CHANGED
  history: string[][][];
  setHistory: Dispatch<SetStateAction<string[][][]>>;
}

/**
 * A command-processor function for our REPL. The function returns a string, which is the value to print to history when
 * the command is done executing.
 *
 * The arguments passed in the input (which need not be named "args") should
 * *NOT* contain the command-name prefix.
 */
export interface REPLFunction {
  (args: Array<string>) : void;
}

export function REPLInput(props: REPLInputProps) {
  const [commandString, setCommandString] = useState<string>("");
  const [count, setCount] = useState<number>(0);
  const [briefMode, setBriefMode] = useState<boolean>(true);
  const { mockedLoadCsv, mockedViewCsv } = csvActions();

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
       output = [["Command: " + args[0] + " " + args[1] + "\n Output: Mode set to verbose"]];
      } else {
        output = [["Wrong argument provided to mode: mode <brief OR verbose>"]];
      }
    } else {
      output = [["Wrong number of arguments provided: mode <brief OR verbose>"]];
    }
    props.setHistory([...props.history, output]);
  };

  /**
   * REPLFunction for loading csv.
   */
  let loadCSV: REPLFunction;
  loadCSV = function (args: Array<string>) {
    let output: string[][];
    if (args.length === 2) {
        output = mockedLoadCsv(args[0])
    } else {
      output = [["Indicate CSV file path: load_file <csv-file-path>"]];
    }
    props.setHistory([...props.history, output]);
  };

  /**
   * REPLFunction for viewing csv.
   */
  let viewCSV: REPLFunction;
  viewCSV = function (args: Array<string>) {
    let output: string[][];
    if (args.length === 0) {
      /* return mockedViewCsv(); */
      output = [["placeholder mockedView"]];
    } else {
      output = [["viewcsv expects no arguments: view"]];
    }
  };

  /**
   * REPLFunction for searching csv.
   */
  let searchCSV: REPLFunction;
  searchCSV = function (args: Array<string>) {
    let output: string[][];
    if (args.length === 2 || args.length === 3) {
      /* return mockedSearchCsv(); */
      output = [["placeholder mockedSearch"]];
    } else {
      output = [["Search formatting incorrect: search <value> <column>"]];
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
    setCount(count + 1);

    const args = commandString.split(" ");
    if (args.length === 0) {
      // nothing entered
      return;
    }
    const command: string = args[0].trim();
    // args.shift();

    if (!(command in commandFunctions)) {
      props.setHistory([...props.history, [["Entered unrecognized command"]]]);
      setCommandString("");
      return;
    }

    const appropriateHandler: REPLFunction = commandFunctions[command];
    appropriateHandler(args);

    // let output: string[][];
    // if (briefMode) {
    //   output = appropriateHandler(args);
    // } else {
    //   output = [["Command: " + commandString + "\n Output: "]].concat(
    //     appropriateHandler(args)
    //   );
    // }
    // props.setHistory([...props.history, output]);
    setCommandString("");
  }

  /**
   * We suggest breaking down this component into smaller components, think about the individual pieces
   * of the REPL and how they connect to each other...
   */
  return (
    <div className="repl-input">
      {/* This is a comment within the JSX. Notice that it's a TypeScript comment wrapped in
            braces, so that React knows it should be interpreted as TypeScript */}
      {/* I opted to use this HTML tag; you don't need to. It structures multiple input fields
            into a single unit, which makes it easier for screenreaders to navigate. */}
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
        Submitted {count} times
      </button>
    </div>
  );
}
