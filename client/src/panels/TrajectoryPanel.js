import DriverSelector from "./DriverSelector"
import TrajectoryPlot from "../plots/TrajectoryPlot"
import TextPanel from "./TextPanel";
import LapSelector from "./LapSelector";
import {useSessionDataContext} from "../context/SessionDataContext";
import {useDriverContext} from "../context/DriverContext";
import {useLapContext} from "../context/LapContext";
import {LinearProgress} from "@mui/material";

export default function TrajectoryPanel({className}) {
    const session = useSessionDataContext();
    const {drivers, selectedDriver} = useDriverContext();
    const {currentLap} = useLapContext();
    return (<div className={className + " overflow-clip h-full flex flex-col"}>
        {(session.session !== null) ?
            (
                drivers !== null?
                <>
                    <DriverSelector/>
                    {currentLap !== null ?
                        <div className="flex flex-col items-center w-full h-full grow pl-1 overflow-clip">
                            <div className="flex flex-col items-center  sm:flex-row w-full grow overflow-clip">
                                <TrajectoryPlot className="h-full w-2/3"
                                                key={selectedDriver + " " + currentLap}/>
                                <div className="h-1/3 w-1/3 flex items-center">
                                    <TextPanel className="h-full w-4/5 mx-auto"/>
                                </div>
                            </div>
                            <LapSelector className="mb-3"/>
                        </div>
                        : null
                    }
                </>


            : <LinearProgress className="my-1 mx-2"/>
            )
            :
            <div><p>Selecciona una sesión para ver la trayectoria</p></div>
        }
    </div>);
}

