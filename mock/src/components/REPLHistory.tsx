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
        <table>
          {command.map((row, index) => (
            <tr>
              {row.map((cell, index) => (
                <td>{cell}</td>
              ))}
            </tr>
          ))}
        </table>
      ))}
    </div>
  );
}
