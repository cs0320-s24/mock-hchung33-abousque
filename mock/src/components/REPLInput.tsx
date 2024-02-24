import { Dispatch, SetStateAction, useState } from 'react';
import '../styles/main.css';
import { ControlledInput } from './ControlledInput';

interface REPLInputProps{
  // TODO: Fill this with desired props... Maybe something to keep track of the submitted commands
  // CHANGED
  history: string[][][],
  setHistory: Dispatch<SetStateAction<string[][][]>>,
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

export function REPLInput(props : REPLInputProps) {
    const [commandString, setCommandString] = useState<string>('');
    const [count, setCount] = useState<number>(0)
    const [briefMode, setBriefMode] = useState<boolean>(true);

    /**
     * REPLFunction for setting mode.
     */
    let setMode: REPLFunction;
    setMode = function (args: Array<string>): string[][] {
      if (args.length === 1) {
        if (args[0] === "brief") {
          setBriefMode(true);
          return [["Mode set to brief"]];
        } else if (args[0] === "verbose") {
          setBriefMode(false);
          return [["Mode set to verbose"]];
        } else {
          return [["Wrong argument provided to mode. mode <brief OR verbose>"]];
        }
      } else {
        return [["Wrong number of arguments provided"]];
      }
    };

    // map lookup to function for cmd
    var commandFunctions: { [cmd: string]: REPLFunction } = {
      mode: setMode,
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
      const command: string = args[0];
      args.shift();

      if (!(command in commandFunctions)) {
        props.setHistory([...props.history, [["Entered unrecognized command"]]]);
        return;
      }
      const appropriateHandler: REPLFunction = commandFunctions[command];

      props.setHistory([...props.history, appropriateHandler(args)]);
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
              <ControlledInput value={commandString} setValue={setCommandString} ariaLabel={"Command input"}/>
            </fieldset>
            {/* TODO: Currently this button just counts up, can we make it push the contents of the input box to the history?*/}
            <button onClick={() => handleSubmit(commandString)}>Submitted {count} times</button>
        </div>
    );
  }

