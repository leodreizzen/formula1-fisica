import OverlappingAccelerationPlot from "./OverlappingAccelerationPlot";
import SplitAccelerationPlot from "./SplitAccelerationPlot";
import {timeDeltaToTimeUnit} from "../client-util";
import {OrbitProgress} from "react-loading-indicators";
import {useMemo} from "react";

export default function AccelerationPlot({className, isDataLoading, accelerationData, timeUnit}) {
    const moduleTrace = useMemo(() => {
            return {
                x: accelerationData?.map(it => timeDeltaToTimeUnit(it.time, timeUnit)),
                y: accelerationData?.map(it => it.acceleration.module / 10),
                type: 'scatter',
                mode: 'lines',
                marker: {color: 'red'},
            }
        }, [accelerationData, timeUnit]);

    const tangentialTrace = useMemo(()=>{
        return {
            x: accelerationData?.map(it => timeDeltaToTimeUnit(it.time, timeUnit)),
            y: accelerationData?.map(it => it.acceleration.aTangential / 10),
            type: 'scatter',
            mode: 'lines',
            marker: {color: 'orange'},
        }
    }, [accelerationData, timeUnit]);
    const normalTrace = useMemo(()=>{
        return {

            x: accelerationData?.map(it => timeDeltaToTimeUnit(it.time, timeUnit)),
            y: accelerationData?.map(it => it.acceleration.aNormal / 10),
            type: 'scatter',
            mode: 'lines',
            marker: {color: 'blue'},
        }
    }, [accelerationData, timeUnit]);

    const traces = {moduleTrace, tangentialTrace, normalTrace};

    return (
        <div className={className + " flex justify-center w-full overflow-clip"}>
            {accelerationData !== null ?
                <>
                    <OverlappingAccelerationPlot className="w-1/2 h-full" isDataLoading={isDataLoading}
                                                 accelerationData={accelerationData} timeUnit={timeUnit}
                                                 traces={traces}/>
                    <SplitAccelerationPlot className="w-1/2 h-full" isDataLoading={isDataLoading}
                                           accelerationData={accelerationData} timeUnit={timeUnit} traces={traces}/>
                </>
                :
                <>
                    <div className="w-1/2 h-full flex items-center justify-center"><OrbitProgress size='large'
                                                                                                  color="#EFE2E2"
                                                                                                  variant='dotted'/>
                    </div>
                    <div className="w-1/2 h-full flex items-center justify-center"><OrbitProgress size='large'
                                                                                                  color="#EFE2E2"
                                                                                                  variant='dotted'/>
                    </div>

                </>

            }

        </div>
    )
}