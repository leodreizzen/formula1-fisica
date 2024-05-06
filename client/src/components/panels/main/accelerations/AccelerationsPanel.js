import DriverSelector from "../../../inputs/DriverSelector";
import AccelerationPlots from "../../../plots/AccelerationPlots";
import MainLapSelector from "../../../inputs/MainLapSelector";

export default function AccelerationsPanel({className}){
    return (<div className={className + " flex flex-col items-center overflow-clip h-full"}>
        <DriverSelector/>
        <AccelerationPlots className="grow pt-2"  timeUnit={"s"}/>
        <MainLapSelector className="mb-3 p-1 pl-6 pr-6"/>
    </div>);
}