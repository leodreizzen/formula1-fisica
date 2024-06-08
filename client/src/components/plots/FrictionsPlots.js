import {timeDeltaToTimeUnit} from "../../client-util";
import {OrbitProgress} from "react-loading-indicators";
import {useMemo} from "react";
import {useSessionDataContext} from "../../context/SessionDataContext";
import {useDriverContext} from "../../context/DriverContext";
import {useLapContext} from "../../context/LapContext";
import {useGetDynamics} from "../../api/hooks";
import OverlappingFrictionsPlot from "./OverlappingFrictionsPlot";
import SplitFrictionsPlot from "./SplitFrictionsPlot";


export default function FrictionsPlots({className, timeUnit}) {
    const sessionData = useSessionDataContext();
    const {currentDriver} = useDriverContext();
    const {currentLap} = useLapContext();

    const year = sessionData.year;
    const round = sessionData.round;
    const session = sessionData.session;
    const [frictionData,] = useGetDynamics(year, round, session, currentDriver?.driverNumber, currentLap)

    const timeTraces = frictionData?.forces.map(it => timeDeltaToTimeUnit(it.time, timeUnit))

    const moduleTrace = useMemo(() => {
            return {
                x: timeTraces,
                y: frictionData?.forces.map(it => it.friction.module / 10),
                type: 'scatter',
                mode: 'lines',
                marker: {color: 'red'},
            }
        }, [frictionData, timeUnit]);

    const tangentialTrace = useMemo(()=>{
        return {
            x: timeTraces,
            y: frictionData?.forces.map(it => it.friction.tangential / 10),
            type: 'scatter',
            mode: 'lines',
            marker: {color: 'orange'},
        }
    }, [frictionData, timeUnit]);
    const normalTrace = useMemo(()=>{
        return {

            x: timeTraces,
            y: frictionData?.forces.map(it => it.friction.normal / 10),
            type: 'scatter',
            mode: 'lines',
            marker: {color: 'blue'},
        }
    }, [frictionData, timeUnit]);

     const staticCoefficientTrace = useMemo(()=>{
        return {
            x: timeTraces,
            y: frictionData?.map(it => (it.coefficient_friction / 10).toFixed(2)),
            type: 'scatter',
            mode: 'lines',
            marker: {color: 'purple'},
        }
    }, [frictionData, timeUnit]);

    const splitTraces = {moduleTrace, tangentialTrace, normalTrace};
    const overlappingTraces = {moduleTrace, tangentialTrace, normalTrace, staticCoefficientTrace};

    return (
        <div className={className + " flex justify-center w-full overflow-clip"}>
            {frictionData !== null ?
                <>
                    <OverlappingFrictionsPlot className="w-1/2 h-full" timeUnit={timeUnit} traces={overlappingTraces}/>
                    <SplitFrictionsPlot className="w-1/2 h-full" timeUnit={timeUnit} traces={splitTraces}/>
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