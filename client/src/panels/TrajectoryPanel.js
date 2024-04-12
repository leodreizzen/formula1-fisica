import {useEffect, useRef, useState} from "react";
import DriverSelector from "./DriverSelector"
import TrajectoryPlot from "../plots/TrajectoryPlot"
import {useGetLaps} from "../api/hooks";
import TextPanel from "./TextPanel";
import LapSelector from "./LapSelector";

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

    return (<div className={className + " h-full"}>
        {(sessionData !== null) ?
            <div>
                <DriverSelector sessionData={sessionData} selectedDriver={driver} onDriverChange={onDriverChange}/>
                {currentLap !== null ?
                    <div className="flex flex-col items-center h-full w-full">
                        <div className="flex flex-col items-center bg-gray-900 sm:flex-row w-full h-auto">
                            <TrajectoryPlot
                                sessionData={sessionData} currentDriver={driver}
                                currentLap={currentLap} key={driver + " " + currentLap}/>
                            <TextPanel/>
                        </div>

                        <LapSelector className={"my-3"} lapCount={lapCount} currentLap={currentLap} changeCurrentLap={onLapChange}/>

                    </div>
                    : null
                }
            </div>
            :
            <div><p>Selecciona una sesión para ver la trayectoria</p></div>
        }
    </div>);
}

