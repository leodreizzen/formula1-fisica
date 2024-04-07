import {useState} from "react";
import { CiSearch  } from "react-icons/ci";
import axios from "axios";
export default function SelectionMenu({className, loadData}){
    const [visible, setVisible] = useState(true);
    const [year, setYear] = useState(0);
    const [rounds, setRounds] = useState([])
    const [selectedRound, setSelectedRound] = useState(null)
    const [selectedSession, setSelectedSession] = useState(null)
    function onYearChange(event){
        setYear(event.target.value);
    }

    function onRoundChange(event){
        setSelectedRound(Number(event.target.value))
    }
    function onSessionChange(event){
        setSelectedSession(Number(event.target.value))
    }
    function onLoadClick(event){
        const round = rounds[selectedRound];
        const session = round.sessions[selectedSession];
        loadData(year, round.roundNumber, session.sessionNumber);
    }

    function onSearchClick(){
        axios.get("http://localhost:3002/rounds", {
            params: {
                year: year
            }
        })
            .then(response => {
                setRounds(response.data);
                if (response.data.length !== 0){
                    setSelectedRound(0);
                    setSelectedSession(0);
                }
            })
    }
    const roundsLoaded = rounds.length !== 0;
    if (visible) {
        return(
            <div className={className + " flex flex-col items-center"}>
                <input className={"border"} id="year" type="button" value="Ocultar" onClick={() => setVisible(false)}/>
                <label className={"block"} htmlFor="year">Año</label>
                <div className={"flex"}>
                    <input type="number" className={"block"} placeholder="Año" onChange={onYearChange}/>
                    <button className={"border my-4 "} onClick={onSearchClick}><CiSearch/></button>
                </div>
                <label className={"block"} htmlFor="ronda">Ronda</label>
                <select value={selectedRound ? selectedRound: ""} className={"block w-full border"} id="ronda" disabled = {roundsLoaded ? null : true} onChange={onRoundChange}>
                    {rounds.map((round, i) => <option key={round.roundNumber} value={i}>{round.roundNumber + " - " + round.eventName + " - " + round.country + " - " + round.location }</option> )}
                </select>

                <label className={"block"} htmlFor="sesion">Sesión</label>
                <select value={selectedSession ? selectedSession: ""} className={"block w-full border"} id="sesion" disabled = {roundsLoaded ? null : true} onChange={onSessionChange}>
                     {
                         selectedRound === null ? null:
                         rounds[selectedRound].sessions.map((session, i) => <option key={session.sessionNumber} value={i}>{session.sessionNumber + " - " + session.name + " - " + session.dateUTC}</option> )
                     }
                </select>
                <button className={"border mt-2"} disabled={selectedSession === null ? true: null} onClick={onLoadClick}>Cargar datos</button>
            </div>
        )
    } else return (
        <div className={className}>
        <input type="button" value="Mostrar" onClick={() => setVisible(true)}/>
        </div>
    );
}

