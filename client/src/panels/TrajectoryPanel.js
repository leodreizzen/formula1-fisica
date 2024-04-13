import {useContext, useEffect, useRef, useState} from "react";
import DriverSelector from "./DriverSelector"
import TrajectoryPlot from "../plots/TrajectoryPlot"
import {useGetLaps} from "../api/hooks";
import TextPanel from "./TextPanel";
import LapSelector from "./LapSelector";
import {SessionDataContext} from "../context/SessionDataContext";

export default function TrajectoryPanel({className, drivers, selectedDriver, onSelectedDriverChange, lapData, currentLap, onLapChange}) {
    const session = useContext(SessionDataContext);

    const lapCount = lapData ? lapData.lapCount : null;
    const fastestLap = lapData ? lapData.fastestLap : null;


    return (<div className={className + " overflow-clip h-full flex flex-col"}>
        {(session !== null) ?
            <>
                <DriverSelector drivers={drivers} selectedDriver={selectedDriver}
                                onDriverChange={onSelectedDriverChange}/>
                {currentLap !== null ?
                    <div className="flex flex-col items-center w-full h-full grow pl-1 overflow-clip">
                        <div className="flex flex-col items-center  sm:flex-row w-full grow overflow-clip">
                            <TrajectoryPlot className="h-full w-2/3" currentDriver={selectedDriver}
                                            currentLap={currentLap} key={selectedDriver + " " + currentLap}/>
                            <TextPanel className= "w-1/3"/>
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

