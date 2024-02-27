import {useState} from "react";

interface REPLModeProps {
    brief: boolean;
}

export function REPLMode(props: REPLModeProps, newBrief: boolean){
    return {
        ...props, brief: newBrief
    };
}

export function changeMode(){
/**
 * REPLFunction for setting mode.
 */
    const [brief, setBrief] = useState<boolean>(true);
    return {brief, setBrief};
}

