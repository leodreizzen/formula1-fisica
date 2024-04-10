import {useEffect, useState} from "react";
import {CiSearch} from "react-icons/ci";
import {useGetRounds} from "../api/api"
import axios from "axios";

export default function SelectionMenu({className, loadData}) {
    const [visible, setVisible] = useState(true);
    const [yearInput, setYearInput] = useState(0);

    const [searchedYear, setSearchedYear] = useState(null);
    const [rounds, roundsLoading] = useGetRounds(searchedYear);

    const [selectedRound, setSelectedRound] = useState(null);
    const [selectedSession, setSelectedSession] = useState(null);


    useEffect(() => {
        if (rounds !== null && rounds.length > 0) {
            setSelectedRound(0);
            setSelectedSession(0);
        }
    }, [rounds]);

    function onYearChange(event) {
        setYearInput(event.target.value);
    }

    function onRoundChange(event) {
        setSelectedRound(Number(event.target.value))
    }

    function onSessionChange(event) {
        setSelectedSession(Number(event.target.value))
    }

    function onSearchClick() {
        setSearchedYear(yearInput)
    }

    function onLoadClick(event) {
        const round = rounds[selectedRound];
        const session = round.sessions[selectedSession];
        loadData(yearInput, round.roundNumber, session.sessionNumber);
    }

    const roundsLoaded = rounds !== null;
    if (visible) {
        return (
            <div className={className + " flex flex-col items-center px-3"}>
                <input className={"border"} id="year" type="button" value="Ocultar" onClick={() => setVisible(false)}/>
                <label className={"block"} htmlFor="year">Año</label>
                <div className={"flex"}>
                    <input type="number" className={"block"} placeholder="Año" onChange={onYearChange}/>
                    <button className={"border my-4 "} onClick={onSearchClick}><CiSearch/></button>
                </div>
                <label className={"block"} htmlFor="ronda">Ronda</label>
                <select value={selectedRound ? selectedRound : ""} className={"block w-full border"} id="ronda"
                        disabled={roundsLoaded ? null : true} onChange={onRoundChange}>
                    {rounds ? (rounds.map((round, i) => <option key={round.roundNumber}
                                                                value={i}>{round.roundNumber + " - " + round.eventName + " - " + round.country + " - " + round.location}</option>))
                        : null}
                </select>

                <label className={"block"} htmlFor="sesion">Sesión</label>
                <select value={selectedSession ? selectedSession : ""} className={"block w-full border"} id="sesion"
                        disabled={roundsLoaded ? null : true} onChange={onSessionChange}>
                    {
                        (selectedRound === null || rounds === null) ? null :
                            rounds[selectedRound].sessions.map((session, i) => <option key={session.sessionNumber}
                                                                                       value={i}>{session.sessionNumber + " - " + session.name + " - " + session.dateUTC}</option>)
                    }
                </select>
                <button className={"border mt-2"} disabled={selectedSession === null ? true : null}
                        onClick={onLoadClick}>Cargar datos
                </button>
            </div>
        )
    } else return (
        <div className={className}>
            <input type="button" value="Mostrar" onClick={() => setVisible(true)}/>
        </div>
    );
}

