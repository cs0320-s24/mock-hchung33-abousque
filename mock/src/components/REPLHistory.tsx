import "../styles/main.css";

interface REPLHistoryProps {
  history: string[][][][];
  brief: boolean;
}

export function REPLHistory(props: REPLHistoryProps) {

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
          <p> {" "} </p> {/* newline for readability */}
        </table>

    )
  }

  function verboseHTML(command: string[][][]) {
    const cmdPrompt: string[][] = command[0];
    const output: string[][] = command[1];

    return (
      <table>
        <tr>
          <td>
            {"Command: " + cmdPrompt}
          </td>
        </tr>
        <tr>
          <td>
            {"Output:"}
          </td>
        </tr>
        {outputHTML(command)}
      </table>
    )
  }

  if (props.brief){
    return(
      <div className="repl-history" aria-label="repl-history">
        {props.history.map((command, index) => (
          outputHTML(command)
      ))}
      </div>
    );

  } else {
    return (
        <div className="repl-history" aria-label="repl-history">
        {props.history.map((command, index) => (
          verboseHTML(command)
      ))}
      </div>
    );

  }
}