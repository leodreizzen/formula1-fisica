import {useEffect, useRef, useState} from "react";
import DriverSelector from "./DriverSelector"
import TrajectoryPlot from "../plots/TrajectoryPlot"
import {useGetLaps} from "../api/hooks";

export default function TrajectoryPanel({className, sessionData}) {
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [currentLap, setCurrentLap] = useState(null);

    const year = sessionData === null ? null : sessionData.year;
    const roundNumber = sessionData === null ? null : sessionData.round;
    const sessionNumber = sessionData === null ? null : sessionData.session;

    const [lapData, lapDataLoading] = useGetLaps(year, roundNumber, sessionNumber, selectedDriver);
    const lapCount = lapData !== null ? lapData.lapCount : null;
    const fastestLap = lapData !== null ? lapData.fastestLap : null;

    function onDriverChange(driverNumber) {
        setSelectedDriver(driverNumber);
        setCurrentLap(null);
    }

    useEffect(() => {
        if (lapCount !== null && lapCount > 0)
            setCurrentLap(1);
    }, [lapCount]);

    return (<div className={className}>
        {(sessionData !== null) ?
            <>
                <DriverSelector sessionData={sessionData} selectedDriver={selectedDriver} onDriverChange={onDriverChange}/>
                    {currentLap !== null ?
                        <TrajectoryPlot sessionData={sessionData} currentDriver={selectedDriver}
                                        currentLap={currentLap} key={selectedDriver + " " + currentLap}/>
                        : null
                    }
            </>
            :
            <div><p>Selecciona una sesión para ver la trayectoria</p></div>
        }
    </div>);
}