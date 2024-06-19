import OverlappingAccelerationPlot from "./OverlappingAccelerationPlot";
import SplitAccelerationPlot from "./SplitAccelerationPlot";
import {timeDeltaToTimeUnit} from "../../client-util";
import {OrbitProgress} from "react-loading-indicators";
import {useMemo} from "react";
import {useKinematicVectorsContext} from "../../context/KinematicVectorsContext";
import {primaryGraphColor, secondaryGraphColor, thirdGraphColor} from "../../styles";

export default function AccelerationPlots({className, timeUnit}) {
    const {vectors} = useKinematicVectorsContext();
    const moduleTrace = useMemo(() => {
            return {
                x: vectors?.map(it => timeDeltaToTimeUnit(it.time, timeUnit)),
                y: vectors?.map(it => it.acceleration.module / 10),
                type: 'scatter',
                mode: 'lines',
                marker: {color: primaryGraphColor},
            }
        }, [vectors, timeUnit]);

    const tangentialTrace = useMemo(()=>{
        return {
            x: vectors?.map(it => timeDeltaToTimeUnit(it.time, timeUnit)),
            y: vectors?.map(it => it.acceleration.aTangential / 10),
            type: 'scatter',
            mode: 'lines',
            marker: {color: secondaryGraphColor},
        }
    }, [vectors, timeUnit]);
    const normalTrace = useMemo(()=>{
        return {
            x: vectors?.map(it => timeDeltaToTimeUnit(it.time, timeUnit)),
            y: vectors?.map(it => it.acceleration.aNormal / 10),
            type: 'scatter',
            mode: 'lines',
            marker: {color: thirdGraphColor},
        }
    }, [vectors, timeUnit]);

    const traces = {moduleTrace, tangentialTrace, normalTrace};

    return (
        <div className={className + " flex justify-center w-full overflow-clip"}>
            {vectors !== null ?
                <>
                    <OverlappingAccelerationPlot className="w-1/2 h-full"
                                                 accelerationData={vectors} timeUnit={timeUnit}
                                                 traces={traces}/>
                    <SplitAccelerationPlot className="w-1/2 h-full"
                                           accelerationData={vectors} timeUnit={timeUnit} traces={traces}/>
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