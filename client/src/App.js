import './App.css';
import MainPanel from "./panels/MainPanel";
import SelectionMenu from "./panels/SelectionMenu";
import {useState} from "react";

function App() {
    const [sessionData, setSessionData] = useState(null);
    function loadData(year, round, session){
        setSessionData({
            year: year,
            round: round,
            session: session
        })
    }
  return (
    <div className="App">
      <SelectionMenu className="SelectionMenu" loadData={loadData}/>
      <MainPanel className="MainPanel" sessionData={sessionData} key={JSON.stringify(sessionData)}/>
    </div>
  );
}

export default App;
