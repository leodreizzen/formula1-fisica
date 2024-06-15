import MainDriverSelector from "../../../inputs/MainDriverSelector";
import FrictionsPlots from "../../../plots/FrictionsPlots";
import MainLapSelector from "../../../inputs/MainLapSelector";

export default function FrictionsPanel({className}){
    return (<div className={className + " flex flex-col items-center overflow-clip h-full"}>
        <MainDriverSelector/>
        <FrictionsPlots className="grow pt-2"  timeUnit={"s"}/>
        <MainLapSelector className="mb-3 p-1 pl-6 pr-6"/>
    </div>);
}