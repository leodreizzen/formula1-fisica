import './App.css';
import MainPanel from "./panels/MainPanel";
import SelectionMenu from "./panels/SelectionMenu";
import {useState} from "react";
import {SessionDataContext} from "./context/SessionDataContext";

function App() {
    const [sessionData, setSessionData] = useState({
        year: null,
        round: null,
        session: null
    });

    function loadData(year, round, session) {
        setSessionData({
            year: year,
            round: round,
            session: session
        })
    }

    return (
        <div className="App ">
            <SelectionMenu className="SelectionMenu" loadData={loadData}/>
            <SessionDataContext.Provider value={sessionData}>
                <MainPanel className="MainPanel" key={JSON.stringify(sessionData)}/>
            </SessionDataContext.Provider>
        </div>
    );
}

export default App;
