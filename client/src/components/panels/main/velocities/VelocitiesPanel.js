import DriverSelector from "../../../inputs/DriverSelector";
import SpeedsPlot from "../../../plots/SpeedsPlot";
import LapSelector from "../../../inputs/LapSelector";

export default function VelocitiesPanel({className}){
    return (<div className={className + " flex flex-col items-center overflow-clip h-full"}>
        <DriverSelector/>
        <SpeedsPlot className="grow pt-2"  timeUnit={"s"}/>
        <LapSelector className="mb-3 p-1 pl-6 pr-6"/>
    </div>);
}