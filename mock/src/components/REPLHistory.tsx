import "../styles/main.css";

interface REPLHistoryProps {
  // TODO: Fill with some shared state tracking all the pushed commands
  // CHANGED
  history: string[][][][];
  brief: boolean;
}

export function REPLHistory(props: REPLHistoryProps) {

  // function briefHistory(output: string[][]){
    
  // }

  // function verboseHistory(command: string[][], output: string[][]){
    
  // }

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
        <p> {" "} </p> {/* newline for readability */}
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


  
  // return (
  //   <div className="repl-history" aria-label="repl-history">
  //     {props.history.map((command, index) => (
  //       // each piece of output is its own table
  //       <table>
  //         const cmdPrompt = {command[0]};
  //         const output: string[][] = {command[1]};
          
  //         if (!props.brief) {
  //           <p> {"Command: " + cmdPrompt} </p>
  //           <p> {"Output:"} </p>
  //         }

  //         // display output
  //         {output.map((row, index) => (
  //           <tr>
  //             {row.map((cell, index) => (
  //               <td>{cell}</td>
  //             ))}
  //           </tr>
  //         ))}
  //       </table>
  //     ))}
  //   </div>
  // );
}