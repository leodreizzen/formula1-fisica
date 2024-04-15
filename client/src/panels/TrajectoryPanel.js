import DriverSelector from "./DriverSelector"
import LapSelector from "./LapSelector";
import {useSessionDataContext} from "../context/SessionDataContext";
import {useDriverContext} from "../context/DriverContext";
import {useLapContext} from "../context/LapContext";
import {LinearProgress} from "@mui/material";
import TrajectoryInfo from "./TrajectoryInfo";

export default function TrajectoryPanel({className}) {
    const session = useSessionDataContext();
    const {drivers, currentDriver} = useDriverContext();
    const {currentLap} = useLapContext();
    return (<div className={className + " overflow-clip h-full flex flex-col"}>
        {(session.session !== null) ?
            (
                drivers !== null?
                <>
                    <DriverSelector/>
                    {currentLap !== null ?
                        <div className="flex flex-col items-center w-full h-full grow pl-1 overflow-clip">
                            <TrajectoryInfo className="w-full grow" key={currentDriver.driverNumber + " " + currentLap}/>
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

