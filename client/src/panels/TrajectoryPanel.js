import {useEffect, useState} from "react";
import DriverSelector from "./DriverSelector"
import TrajectoryPlot from "../plots/TrajectoryPlot"
import axios from "axios";

export default function TrajectoryPanel({className, sessionData}){
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [laps, setLaps] = useState([]);
    const [trajectory, setTrajectory] = useState([]);
    const [currentLap, setCurrentLap] = useState(null);
    function onDriverChange(driverNumber){
        setSelectedDriver(driverNumber);
    }

    useEffect(() => {
        if (selectedDriver !== null && sessionData){
            axios.get("http://localhost:3002/laps", {
                params: {
                    year: sessionData.year,
                    roundNumber: sessionData.round,
                    sessionNumber: sessionData.session,
                    driverNumber: selectedDriver
                }
            })
                .then(response => {
                    setLaps(response.data.lapCount);
                    if (response.data.lapCount !== 0) {
                        setCurrentLap(1);
                    }
                })
        }
    }, [selectedDriver, sessionData]);

    useEffect(() => {
        if (sessionData && currentLap !== null && selectedDriver !== null){
            axios.get("http://localhost:3002/trajectory", {
                params: {
                    year: sessionData.year,
                    roundNumber: sessionData.round,
                    sessionNumber: sessionData.session,
                    driverNumber: selectedDriver,
                    lapNumber: currentLap
                }
            })
            .then(response => {
                setTrajectory(response.data);
            })
        }
    }, [selectedDriver, sessionData, currentLap]);
    return (<div className={className}>
        {sessionData ?
            <>
                <DriverSelector sessionData={sessionData} onDriverChange={onDriverChange}/>
                <TrajectoryPlot trajectoryData={trajectory}/>
            </>
            :
            <div><p>Selecciona una sesión para ver la trayectoria</p></div>
        }
    </div>);
}