import DriverSelector from "./DriverSelector";
import AccelerationPlot from "../plots/AccelerationPlot";
import LapSelector from "./LapSelector";

export default function AccelerationsPanel({className}){
    return (<div className={className + " flex flex-col items-center overflow-clip h-full"}>
        <DriverSelector/>
        <AccelerationPlot className="grow pt-2"  timeUnit={"s"}/>
        <LapSelector className="mb-3"/>
    </div>);
}