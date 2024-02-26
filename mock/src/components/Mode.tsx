import { Dispatch, SetStateAction} from "react";

interface ModeProps {
  brief: boolean,
  setBrief: Dispatch<SetStateAction<boolean>>;
}

interface Mode {
  setMode (args: Array<string>): string[][];
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

export function Mode(props: ModeProps) {
/**
 * REPLFunction for setting mode.
 */
function setMode (args: Array<string>): string[][] {
    if (args.length === 1) {
      if (args[0] === "brief") {
        props.setBrief(true);
        return [["Mode set to brief"]];
      } else if (args[0] === "verbose") {
        props.setBrief(false);
        return [["Mode set to verbose"]];
      } else {
        return [["Wrong argument provided to mode: mode <brief OR verbose>"]];
      }
    } else {
      return [["Wrong number of arguments provided: mode <brief OR verbose>"]];
    }
  };
  // return (null);

  return setMode;
}

