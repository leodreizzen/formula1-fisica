import {useEffect, useRef, useState} from "react";
import DriverSelector from "./DriverSelector"
import TrajectoryPlot from "../plots/TrajectoryPlot"
import {useGetLaps} from "../api/hooks";
import TextPanel from "./TextPanel";

export default function TrajectoryPanel({className, sessionData, driver, onDriverChange, currentLap, onLapChange}) {

    const year = sessionData === null ? null : sessionData.year;
    const roundNumber = sessionData === null ? null : sessionData.round;
    const sessionNumber = sessionData === null ? null : sessionData.session;

    const [lapData, lapDataLoading] = useGetLaps(year, roundNumber, sessionNumber, driver);
    const lapCount = lapData !== null ? lapData.lapCount : null;
    const fastestLap = lapData !== null ? lapData.fastestLap : null;

    useEffect(() => {
        if (lapCount !== null && lapCount > 0)
            onLapChange(1);
    }, [lapCount, onLapChange]);

    return (<div className={className}>
        {(sessionData !== null) ?
            <>
                <DriverSelector sessionData={sessionData} selectedDriver={driver} onDriverChange={onDriverChange}/>
                    {currentLap !== null ?
                        <div className="flex items-center">
                        <TrajectoryPlot sessionData={sessionData} currentDriver={driver}
                                        currentLap={currentLap} key={driver + " " + currentLap}/>
                        <TextPanel/>
                        </div>
                        : null
                    }
            </>
            :
            <div><p>Selecciona una sesión para ver la trayectoria</p></div>
        }
    </div>);
}

