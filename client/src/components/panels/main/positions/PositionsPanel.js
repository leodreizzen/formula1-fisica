import MainDriverSelector from "../../../inputs/MainDriverSelector";
import MainLapSelector from "../../../inputs/MainLapSelector";
import {PositionsPlot} from "../../../plots/PositionsPlot";


export default function PositionsPanel({className}){
    return (
        <div className={className + " flex flex-col items-center overflow-clip h-full"}>
            <MainDriverSelector/>
            <PositionsPlot className="grow pt-2" timeUnit={"s"}/>
            <MainLapSelector className="mb-3 p-1 pl-6 pr-6"/>
        </div>
    );
}