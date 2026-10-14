import { decodeDeckCode } from "./features/deck/decodeDeckCode";


function App() {


const decoded = 'CMAAAAAAAAAACAQAAAD5MAIAAABQGAAABEGNGAIDAMAAHGYBV4AQEBAAAKMQCBADAAAAJUIB3UAQCAYAXQAQCBAAAYAQKAEAAEBQIAAADPKQDIYCUYBAEAYADW5QCAQEACYADUQBAABQCAAA2QAQCAYACUAQKAADAMAQGAABAECABMABAICQBAYBQ4AQCAYADU';

const result = decodeDeckCode(decoded)

console.log(result)


    
  return (
    <> 
    <div>Test test</div>
    </>
  )
}

export default App