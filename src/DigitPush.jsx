import { Actions } from './App'

export default function DigitPush({setAction, digit}){
  return (
    <button 
      onClick={()=>setAction({type: Actions.Add_Digit, payload: {digit}})}
      >
      {digit}
    </button>
  )
}