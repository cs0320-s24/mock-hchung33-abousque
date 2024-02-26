import "../styles/main.css";

interface REPLHistoryProps {
  // TODO: Fill with some shared state tracking all the pushed commands
  // CHANGED
  history: string[][][];
}
export function REPLHistory(props: REPLHistoryProps) {
  return (
    <div className="repl-history" aria-label="repl-history">
      {props.history.map((command, index) => (
        // each command output is its own table
        <table>
          {command.map((row, index) => (
            // command vs. output vs. csv output row are their own newlines
            <tr>
              {row.map((cell, index) => (
                // each element is in its own cell (col) within row
                <td>{cell}</td>
              ))}
            </tr>
          ))}
        </table>
      ))}
    </div>
  );
}
