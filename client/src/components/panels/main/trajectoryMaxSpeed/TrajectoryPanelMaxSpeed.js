import MainDriverSelector from "../../../inputs/MainDriverSelector";
import MainLapSelector from "../../../inputs/MainLapSelector";
import {useDriverContext} from "../../../../context/DriverContext";
import {useLapContext} from "../../../../context/LapContext";
import TrajectoryInfoMaxSpeed from "./TrajectoryInfoMaxSpeed";

export default function TrajectoryPanelMaxSpeed({className}){
    const {currentDriver} = useDriverContext();
    const {currentLap} = useLapContext();

    return (<div className={className + " flex flex-col items-center overflow-clip h-full"}>
        <MainDriverSelector/>
        <div className="flex flex-col items-center w-full h-full grow pl-1 overflow-clip">
            <TrajectoryInfoMaxSpeed className="w-full grow" key={currentDriver.driverNumber + " " + currentLap}/>
        </div>
        <MainLapSelector className="mb-3 p-1 pl-6 pr-6"/>
    </div>);
}