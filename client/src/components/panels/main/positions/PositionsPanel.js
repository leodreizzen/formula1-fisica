import DriverSelector from "../../../inputs/DriverSelector";
import LapSelector from "../../../inputs/LapSelector";
import {PositionsPlot} from "../../../plots/PositionsPlot";


export default function PositionsPanel({className}){
    return (
        <div className={className + " flex flex-col items-center overflow-clip h-full"}>
            <DriverSelector/>
            <PositionsPlot className="grow pt-2" timeUnit={"s"}/>
            <LapSelector className="mb-3 p-1 pl-6 pr-6"/>
        </div>
    );
}