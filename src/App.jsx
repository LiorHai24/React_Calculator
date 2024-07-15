import { useReducer } from 'react'
import DigitPush from './DigitPush'
import OperationPush from './OperationPush'
import './App.css'


export const Actions = {
  Add_Digit: 'ADD_DIGIT',
  Add_Operation: 'ADD_OPERATION',
  Add_Decimal: 'ADD_DECIMAL',
  Add_Parentheses: 'ADD_PARENTHESES',
  Clear: 'CLEAR',
  Delete: 'DELETE',
  Equal: 'EQUAL'
}



function reducer(state, {type, payload}) {
  console.log("payload",payload)
  console.log("state",state)
  switch (type) 
  {
    case Actions.Add_Digit:
      if(state.Overwrite)
      {
        return{
          ...state,
          Overwrite: false,
          current: payload.digit
        }
      }
      if (state.current === "0" && payload.digit === "0" ){
        return state
      }
      if (state.current.includes(".") && payload.digit === ".")
      {
        return state
      }
      if(state.current.endsWith(")"))
      {
        return {
          ...state,
          previous: "",
          operation: "",
          current: "error",
          Overwrite : true
        }
      }
      return {
        ...state,
        current: `${state.current || ""}${payload.digit}`
      }
    case Actions.Clear: return {current:"",previous:"",operation:""}
    case Actions.Add_Operation:
      if (state.current == "" && state.previous == "")
      {
        if(payload.operation == "-")
        {
          return {
            ...state,
            current: payload.operation
          }
        }
        return state
      }
      if (state.current == "")
      {
        return {
        ...state,
        operation: payload.operation,
        }
      }
      if (state.previous == "")
      {
        if(state.current == "(")
        {
          return {
            ...state,
            previous: "",
            operation: "",
            current: "error",
            Overwrite : true
          }
        }
        return {
          ...state,
          operation: payload.operation,
          previous: state.current,
          current: ""
        }
      }
      else
      {
        return {
          ...state,
          previous: evaluate(state),
          operation: payload.operation,
          current: ""
        }
      }

    case Actions.Equal:
      if(state.current == "" || state.previous == "" || state.operation == "")
      {
        return state
      }
      return {
        ...state,
        previous: "",
        current: evaluate(state),
        operation: "",
        Overwrite : true
      }
    case Actions.Delete:
      if(state.Overwrite)
      {
        return{
          ...state,
          Overwrite: false,
          current: ""
        }
      }
      if(state.current == "") return state
      if(state.current.length == 1) return {...state, current: ""}
      return {
        ...state,
        current: state.current.slice(0, -1)
      }
    default:
      return {
        ...state,
        previous: evaluate(state),
        operation: payload.operation,
        current: ""
      }
    }
} 

function evaluate({current, previous, operation, Overwrite}) {
  while (previous.startsWith("(") && current.includes(")")) {
    let first = previous.indexOf("(");
    let last = current.indexOf(")");
    console.log("first", first);
    console.log("last", last);
    previous = previous.slice(first + 1);
    current = current.slice(0, last);
  }
  
  if (previous.includes("(") || current.includes(")")) 
  {
    previous = "";
    operation = "";
    current = "";
    Overwrite = true;
    return "error"
  }
  const prev = parseFloat(previous)
  const curr = parseFloat(current)
  if (isNaN(prev) || isNaN(curr)) {
    return ""
  }
  let computation = ""
  switch (operation) {
    case "+":
      computation = prev + curr
      break
    case "-":
      computation = prev - curr
      break
    case "x":
      computation = prev * curr
      break
    case "÷":
      computation = prev / curr
      break
  }
  return computation.toString()

}


function App() {

  const [{current, previous, operation}, setAction] = useReducer(reducer, {current:"",previous:"",operation:"", Overwrite: false})
    return (
    <div className="calculatorStructure">
      <div className="output">
        <div className="previous">{previous} {operation}</div>
        <div className="current">{current}</div>
      </div>
      <button onClick={() => setAction({type: Actions.Clear})}>AC</button>
      <button onClick={()=>setAction({type: Actions.Delete})}>DEL</button>
      <DigitPush digit = "(" setAction = {setAction} />
      <DigitPush digit = ")" setAction = {setAction} />
      <OperationPush operation="÷" setAction = {setAction} />
      <DigitPush digit = "7" setAction = {setAction} />
      <DigitPush digit = "8" setAction = {setAction} />
      <DigitPush digit = "9" setAction = {setAction} />
      <OperationPush operation = "x" setAction = {setAction} />
      <DigitPush digit = "4" setAction = {setAction} />
      <DigitPush digit = "5" setAction = {setAction} />
      <DigitPush digit = "6" setAction = {setAction} />
      <OperationPush operation = "+" setAction = {setAction} />
      <DigitPush digit = "1" setAction = {setAction} />
      <DigitPush digit = "2" setAction = {setAction} />
      <DigitPush digit = "3" setAction = {setAction} />
      <OperationPush operation = "-" setAction = {setAction} />
      <DigitPush digit = "0" setAction = {setAction} />
      <DigitPush digit = "." setAction = {setAction} />
      <button onClick={()=> setAction({type: Actions.Equal})}>=</button>
    </div>
  )
}

export default App