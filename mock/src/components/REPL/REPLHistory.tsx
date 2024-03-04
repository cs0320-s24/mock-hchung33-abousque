import "../../styles/main.css";

interface REPLHistoryProps {
  history: string[][][][];
  brief: boolean;
}

/**
 * Main function for exporting REPL History to user display.
 *
 * @param props - REPLHistoryProps including the array of past commands
 * and the state of the display as in brief mode vs. verbose Mode
 * @returns the HTML to display to the user display
 */
export function REPLHistory(props: REPLHistoryProps) {
  /**
   * Compiles and formats HTML to display a command's output.
   * This is all the HTML output necessary for a command in brief mode.
   *
   * @param command - the string[][][] detailing a single command (input and output)
   */
  function outputHTML(command: string[][][]) {
    const output: string[][] = command[1];
    return (
      <table>
        {output.map((row, index) => (
          <tr>
            {row.map((cell, index) => (
              <td>{cell}</td>
            ))}
          </tr>
        ))}
        <p></p>
        {/* newline for readability */}
      </table>
    );
  }

  /**
   * Compiles and formats HTML to display a command's output in verbose.
   *
   * @param command - the string[][][] detailing a single command (input and output)
   */
  function verboseHTML(command: string[][][]) {
    const cmdPrompt: string[][] = command[0];
    const output: string[][] = command[1];

    return (
      <table>
        <tr>
          <td>{"Command: " + cmdPrompt}</td>
        </tr>
        <tr>
          <td>{"Output:"}</td>
        </tr>
        {outputHTML(command)}
      </table>
    );
  }

  if (props.brief) {
    return (
      <div className="repl-history" aria-label="repl-history">
        {props.history.map((command, index) => outputHTML(command))}
      </div>
    );
  } else {
    return (
      <div className="repl-history" aria-label="repl-history">
        {props.history.map((command, index) => verboseHTML(command))}
      </div>
    );
  }
}
