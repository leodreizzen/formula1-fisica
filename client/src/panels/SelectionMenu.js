import {useEffect, useState} from "react";
import {CiSearch} from "react-icons/ci";
import {useGetRounds} from "../api/hooks.js"
import axios from "axios";
import {MdOutlineMenu, MdOutlineMenuOpen} from "react-icons/md";
import {dateUTC_to_LocalTimezone} from "../client-util.js"

export default function SelectionMenu({className, loadData}) {
    const [visible, setVisible] = useState(true);
    const [yearInput, setYearInput] = useState(0);

    const [searchedYear, setSearchedYear] = useState(null);
    const [rounds, roundsLoading] = useGetRounds(searchedYear);

    const [selectedRound, setSelectedRound] = useState(null);
    const [selectedSession, setSelectedSession] = useState(null);
    const [isMenuVisible, setMenuVisible] = useState(true)

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

    function onLoadClick() {
        const round = rounds[selectedRound];
        const session = round.sessions[selectedSession];
        onMenuClick()
        loadData(yearInput, round.roundNumber, session.sessionNumber);
    }

    function onMenuClick(){
         isMenuVisible? setMenuVisible(false): setMenuVisible(true);
         setVisible(isMenuVisible);
    }

    const handleKeypress = e => {
    if (e.key === 'Enter') {
      onSearchClick();
    }
  };

    const roundsLoaded = rounds !== null;
    if (visible) {
        return (
            <div className={className + " flex flex-col items-center px-3  border-r-2 h-full"}>
                <MdOutlineMenuOpen className={"border my-4 w-8 h-8 rounded-md"} id="menu" type="button" onClick={onMenuClick}/>
                <label className={"block"} htmlFor="year">Año</label>
                <div className={"flex "}>
                    <input type="number" className={"block border rounded-sm "} placeholder="Año" onChange={onYearChange} onKeyPress={handleKeypress}/>
                    <button className={"border my-4 "} onClick={onSearchClick}><CiSearch/></button>
                </div>
                <label className={"block my-5"} htmlFor="ronda">Ronda</label>
                <select value={selectedRound ? selectedRound : ""} className={"block w-full border"} id="ronda"
                        disabled={roundsLoaded ? null : true} onChange={onRoundChange}>
                    {rounds ? (rounds.map((round, i) => <option key={round.roundNumber}
                                                                value={i}>{round.roundNumber + " - " + round.eventName + " - " + round.country + " - " + round.location}</option>))
                        : null}
                </select>

                <label className={"block my-5"} htmlFor="sesion">Sesión</label>
                <select value={selectedSession ? selectedSession : ""} className={"block w-full border"} id="sesion"
                        disabled={roundsLoaded ? null : true} onChange={onSessionChange}>
                    {
                        (selectedRound === null || rounds === null) ? null :
                            rounds[selectedRound].sessions.map((session, i) => <option key={session.sessionNumber}
                                                                                       value={i}>{session.sessionNumber + " - " + session.name + " - " + dateUTC_to_LocalTimezone(session.dateUTC)} </option>)
                    }
                </select>
                <button className={"border my-5 rounded-md"} disabled={selectedSession === null ? true : null}
                        onClick={onLoadClick}>Cargar datos
                </button>
            </div>
        )
    } else return (
        <div className={className + " top-0 h-auto"}>
            <MdOutlineMenu
                className={" my-5 h-8 w-8 border rounded-md"}
                id="menu"
                type="button"
                onClick={onMenuClick}
            />
        </div>
    );
}

