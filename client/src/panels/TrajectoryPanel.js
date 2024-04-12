import {useEffect, useRef, useState} from "react";
import DriverSelector from "./DriverSelector"
import TrajectoryPlot from "../plots/TrajectoryPlot"
import {useGetLaps} from "../api/hooks";
import TextPanel from "./TextPanel";
import LapSelector from "./LapSelector";

export default function TrajectoryPanel({className, sessionData, drivers, selectedDriver, onSelectedDriverChange, currentLap, onLapChange}) {

    const year = sessionData === null ? null : sessionData.year;
    const roundNumber = sessionData === null ? null : sessionData.round;
    const sessionNumber = sessionData === null ? null : sessionData.session;

    const [lapData, lapDataLoading] = useGetLaps(year, roundNumber, sessionNumber, selectedDriver);
    const lapCount = lapData !== null ? lapData.lapCount : null;
    const fastestLap = lapData !== null ? lapData.fastestLap : null;

    useEffect(() => {
        if (lapCount !== null && lapCount > 0)
            onLapChange(1);
    }, [lapCount, onLapChange]);

    return (<div className={className}>
        {(sessionData !== null) ?
            <>
                <DriverSelector drivers={drivers} sessionData={sessionData} selectedDriver={selectedDriver} onDriverChange={onSelectedDriverChange}/>
                {currentLap !== null ?
                    <div className="flex flex-col items-center">
                        <div className="flex items-center">
                            <TrajectoryPlot sessionData={sessionData} currentDriver={selectedDriver}
                                            currentLap={currentLap} key={selectedDriver + " " + currentLap}/>
                            <TextPanel/>
                        </div>

                    <LapSelector lapCount={lapCount} currentLap={currentLap} changeCurrentLap={onLapChange}/>
                    </div>
                    : null
                }
            </>
            :
            <div><p>Selecciona una sesión para ver la trayectoria</p></div>
        }
    </div>);
}

