import { useState } from 'react';
import '../styles/main.css';
import { REPLHistory } from './REPLHistory';
import { REPLInput } from './REPLInput';

export default function REPL() {
  const [history, setHistory] = useState<string[][][][]>([])
  const [brief, setBrief] = useState<boolean>(true);

  return (
    <div className="repl">
      <REPLHistory history={history} brief={brief}/>
      <hr></hr>
      <REPLInput history={history} setHistory={setHistory} brief={brief} setBrief={setBrief}/>
    </div>
  );
}
