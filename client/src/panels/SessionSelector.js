import {dateUTC_to_LocalTimezone} from "../client-util";
import {useEffect, useState} from "react";

export default function SessionSelector({className, rounds, onLoadDataClick}) {
    const [selectedRound, setSelectedRound] = useState(null);
    const [selectedSession, setSelectedSession] = useState(null);

    useEffect(() => {
        if (rounds !== null && rounds.length > 0) {
            setSelectedRound(0);
            setSelectedSession(0);
        }
    }, [rounds]);

    function onRoundChange(event) {
        setSelectedRound(Number(event.target.value))
    }

    function onSessionChange(event) {
        setSelectedSession(Number(event.target.value))
    }

    function onLoadClick() {
        const round = rounds[selectedRound];
        const session = round.sessions[selectedSession];
        onLoadDataClick(round.roundNumber, session.sessionNumber)
    }

    return <div className={className}>
        <label className={"block mb-1 mt-5 text-white text-left p-1"} htmlFor="ronda">Ronda:</label>
        <select value={selectedRound !== null ? selectedRound : ""}
                className={"block w-full border border-gray-400 rounded-md text-white bg-gray-900 p-1"} id="ronda"
                onChange={onRoundChange}>
            {rounds ? (rounds.map((round, i) => <option key={round.roundNumber}
                                                        value={i}>{round.roundNumber + " - " + round.eventName + " - " + round.country + " - " + round.location}</option>))
                : null}
        </select>

        <label className={"block mb-1 mt-5 text-white text-left p-1"} htmlFor="sesion">Sesión:</label>
        <select value={selectedSession !== null ? selectedSession : ""}
                className={" text-white block w-full border border-gray-400 rounded-md bg-gray-900 p-1"} id="sesion"
                onChange={onSessionChange}>
            {
                selectedRound === null ? null :
                    rounds[selectedRound].sessions.map((session, i) => <option key={session.sessionNumber}
                                                        value={i}>{session.sessionNumber + " - " + session.name + " - " + dateUTC_to_LocalTimezone(session.dateUTC)} </option>)
            }
        </select>
        <button className={"text-white p-2 pr-6 pl-6 border border-gray-400 my-10 rounded-md bg-gray-900"}
                disabled={selectedSession === null ? true : null}
                onClick={onLoadClick}>Cargar datos
        </button>
    </div>
}