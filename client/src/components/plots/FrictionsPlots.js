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
        }, [timeTraces, frictionData]);

    const tangentialTrace = useMemo(()=>{
        return {
            x: timeTraces,
            y: frictionData?.forces.map(it => it.friction.tangential / 10),
            type: 'scatter',
            mode: 'lines',
            marker: {color: 'orange'},
        }
    }, [frictionData, timeTraces]);
    const normalTrace = useMemo(()=>{
        return {
            x: timeTraces,
            y: frictionData?.forces.map(it => it.friction.normal / 10),
            type: 'scatter',
            mode: 'lines',
            marker: {color: 'blue'},
        }
    }, [timeTraces, frictionData]);

    const traces = {moduleTrace, tangentialTrace, normalTrace};

    return (
        <div className={className + " flex justify-center w-full overflow-clip"}>
            {frictionData !== null ?
                <>
                    <OverlappingFrictionsPlot className="w-1/2 h-full" timeUnit={timeUnit} traces={traces}
                    maxFrictionValue = {frictionData?.max_friction} coefficientValue = {frictionData?.coefficient_friction} avgFrictionValue={frictionData?.avg_friction}/>
                    <SplitFrictionsPlot className="w-1/2 h-full" timeUnit={timeUnit} traces={traces}/>
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