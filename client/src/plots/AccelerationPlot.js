import OverlappingAccelerationPlot from "./OverlappingAccelerationPlot";
import SplitAccelerationPlot from "./SplitAccelerationPlot";
import {dateUTC_to_timeUnit} from "../client-util";

export default function AccelerationPlot({className, isDataLoading, accelerationData, timeUnit}){
    const moduleTrace = {
        x: Number(dateUTC_to_timeUnit(accelerationData.map(it => it.time), timeUnit)),
        y: accelerationData.map(it => it.acceleration.module / 10),
        type: 'scatter',
        mode: 'lines',
        marker: {color: 'red'},
    };
    const tangentialTrace = {
        x: Number(dateUTC_to_timeUnit(accelerationData.map(it => it.time), timeUnit)),
        y: accelerationData.map(it => it.acceleration.aTangential / 10),
        type: 'scatter',
        mode: 'lines',
        marker: {color: 'orange'},
    };
    const normalTrace = {
        x: Number(dateUTC_to_timeUnit(accelerationData.map(it => it.time), timeUnit)),
        y: accelerationData.map(it => it.acceleration.aNormal / 10),
        type: 'scatter',
        mode: 'lines',
        marker: {color: 'blue'},
    };

    const traces = {moduleTrace, tangentialTrace, normalTrace};

    return (
        <div className={className + " flex justify-center"}>
            <OverlappingAccelerationPlot className="w-1/2 h-full" isDataLoading = {isDataLoading} accelerationData={accelerationData} timeUnit={timeUnit} traces={traces}/>
            <SplitAccelerationPlot className="w-1/2 h-full" isDataLoading = {isDataLoading} accelerationData={accelerationData} timeUnit={timeUnit} traces={traces}/>
        </div>
    )
}