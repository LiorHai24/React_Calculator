import { Actions } from './App'

export default function OperationPush({setAction, operation}){
  return (
    <button onClick={()=>setAction({type: Actions.Add_Operation, payload: {operation}})}>
      {operation}
    </button>
  );
}