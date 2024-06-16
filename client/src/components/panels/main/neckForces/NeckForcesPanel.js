import { useSessionDataContext } from "../../../../context/SessionDataContext";
import { useDriverContext } from "../../../../context/DriverContext";
import { useLapContext } from "../../../../context/LapContext";
import { LinearProgress } from "@mui/material";
import NeckForcesInfo from "./NeckForcesInfo";
import MainDriverSelector from "../../../inputs/MainDriverSelector";
import MainLapSelector from "../../../inputs/MainLapSelector";

export default function NeckForcesPanel({ className }) {
    const session = useSessionDataContext();
    const { drivers, currentDriver } = useDriverContext();
    const { currentLap } = useLapContext();
    return (<div className={className + " overflow-clip h-full flex flex-col"}>
        {(session.session !== null) ?
            (
                drivers !== null ?
                    <>
                        <MainDriverSelector />
                        {currentLap !== null ?
                            <div className="flex flex-col items-center w-full h-full grow pl-1 overflow-clip">
                                <NeckForcesInfo className="w-full grow" key={currentDriver.driverNumber + " " + currentLap} />
                                <MainLapSelector className="mb-3 p-1 pl-6 pr-6" currentLap={currentLap} />
                            </div>
                            : null
                        }
                    </>
                    : <LinearProgress className="my-1 mx-2" />
            )
            : <div><p>Selecciona una sesión para ver las fuerzas del cuello</p></div>
        }
    </div>);
}