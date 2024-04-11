import OverlappingAccelerationPlot from "./OverlappingAccelerationPlot";
import SplitAccelerationPlot from "./SplitAccelerationPlot";

export default function AccelerationPlot({className, isDataLoading, accelerationData, timeUnit}){
    return (
        <div className={className + " flex justify-center"}>
            {<OverlappingAccelerationPlot className="w-1/2" isDataLoading = {isDataLoading} accelerationData={accelerationData} timeUnit={timeUnit}/>}
            <SplitAccelerationPlot className="w-1/2" isDataLoading = {isDataLoading} accelerationData={accelerationData} timeUnit={timeUnit}/>
        </div>
    )
}