import {useEffect, useState} from "react";
import DriverSelector from "./DriverSelector"
import TrajectoryPlot from "../plots/TrajectoryPlot"
import {useGetLaps, useGetTrajectory} from "../api/api";
import {OrbitProgress} from "react-loading-indicators";

export default function TrajectoryPanel({className, sessionData}){
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [laps, setLaps] = useState([]);
    const [currentLap, setCurrentLap] = useState(null);

    const year = sessionData === null ? null : sessionData.year;
    const roundNumber = sessionData === null ? null : sessionData.round;
    const sessionNumber = sessionData === null ? null : sessionData.session;

    const [lapData, lapDataLoading] = useGetLaps(year, roundNumber, sessionNumber, selectedDriver);
    const [trajectory, trajectoryLoading] = useGetTrajectory(year, roundNumber, sessionNumber, selectedDriver, currentLap);

    const lapCount = lapData !== null ? lapData.lapCount : null;
    const fastestLap = lapData !== null ? lapData.fastestLap : null;

    function onDriverChange(driverNumber){
        setSelectedDriver(driverNumber);
    }

    useEffect(() => {
        if (lapCount !== null && lapCount > 0){
            setCurrentLap(1);
        }
    }, [lapCount]);

    return (<div className={className}>
        {sessionData !== null ?
            <>
                <DriverSelector sessionData={sessionData} onDriverChange={onDriverChange}/>
                {trajectory ?   <TrajectoryPlot trajectoryData={trajectory}/> :
                                trajectoryLoading ? <OrbitProgress/> : null}
            </>
            :
            <div><p>Selecciona una sesión para ver la trayectoria</p></div>
        }
    </div>);
}