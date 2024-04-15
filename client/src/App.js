import './App.css';
import MainPanel from "./panels/MainPanel";
import SelectionMenu from "./panels/SelectionMenu";
import {useState} from "react";
import {SessionDataContext} from "./context/SessionDataContext";
import {createTheme, ThemeProvider} from "@mui/material/styles";

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
        <ThemeProvider theme={createTheme({palette: {mode: 'dark',}, color: '#8F8F8F'})}>
        <div className="App ">
            <SelectionMenu className="SelectionMenu" loadData={loadData}/>
            <SessionDataContext.Provider value={sessionData}>
                <MainPanel className="MainPanel" key={JSON.stringify(sessionData)}/>
            </SessionDataContext.Provider>
        </div>
        </ThemeProvider>
    );
}

export default App;
