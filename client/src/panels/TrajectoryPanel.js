import {useContext, useEffect, useRef, useState} from "react";
import DriverSelector from "./DriverSelector"
import TrajectoryPlot from "../plots/TrajectoryPlot"
import {useGetLaps} from "../api/hooks";
import TextPanel from "./TextPanel";
import LapSelector from "./LapSelector";
import {SessionDataContext} from "../context/SessionDataContext";

export default function TrajectoryPanel({className, drivers, selectedDriver, onSelectedDriverChange, lapData , currentLap, onLapChange}) {
    const {year, round, session} = useContext(SessionDataContext);

    const lapCount = lapData ? lapData.lapCount : null;
    const fastestLap = lapData ? lapData.fastestLap : null;


    return (<div className={className + " h-full"}>
        {(session !== null) ?
            <>
                <DriverSelector drivers={drivers} selectedDriver={selectedDriver} onDriverChange={onSelectedDriverChange}/>
                {currentLap !== null ?
                    <div className="flex flex-col items-center h-full w-full pl-1">
                    <div className="flex flex-col items-center bg-gray-900 sm:flex-row w-full h-auto">
                            <TrajectoryPlot currentDriver={selectedDriver}
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

