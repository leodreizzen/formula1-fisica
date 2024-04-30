import { useMemo } from "react";
import { useVectorsContext } from "../../context/VectorsContext";
import {OrbitProgress} from "react-loading-indicators";
import ComparativeAccelerationPlot from "./ComparativeAccelerationPlot";
import ComparativeSpeedPlot from "./ComparativeSpeedPlot";

export default function ComparativePlots({ className, timeUnit, trajectoryData, trajectorySecondaryData, currentDriver, currentSecondaryDriver, currentLap }) {
    const { vectors } = useVectorsContext();

    const plotVelocityData = useMemo(() => {
        let data = [];
        if (trajectoryData && trajectorySecondaryData && vectors) {
            data.push({
                x: trajectoryData.map(it => it.intrinsic.s / 10),
                y: vectors.map(it => it.velocity.module / 10),
                type: 'scatter',
                mode: 'lines',
                marker: { color: 'red' },
                hoverinfo: 'none',
                name: 'Conductor ' + currentDriver.fullName
            })

            data.push({
                x: trajectorySecondaryData.map(it => it.intrinsic.s / 10),
                y: vectors.map(it => it.velocity.module / 10),
                type: 'scatter',
                mode: 'lines',
                marker: { color: 'yellow' },
                hoverinfo: 'none',
                name: 'Conductor ' + currentSecondaryDriver.fullName
            })
        }
        return data;
    }, [trajectoryData, trajectorySecondaryData, vectors]);

    const plotAccelerationData = useMemo(() => {
        let data = [];
        if (trajectoryData && vectors && trajectorySecondaryData) {
            data.push({
                x: trajectoryData.map(it => it.intrinsic.s / 10),
                y: vectors.map(it => it.acceleration.module / 10),
                type: 'scatter',
                mode: 'lines',
                marker: { color: 'red' },
                hoverinfo: 'none',
                name: 'Conductor ' + currentDriver.fullName
            })
        
            data.push({
                x: trajectorySecondaryData.map(it => it.intrinsic.s / 10),
                y: vectors.map(it => it.acceleration.module / 10),
                type: 'scatter',
                mode: 'lines',
                marker: { color: 'yellow' },
                hoverinfo: 'none',
                name: 'Conductor ' + currentSecondaryDriver.fullName
            })
        }
        return data;
    }, [trajectoryData, trajectorySecondaryData, vectors]);

    return (
        <div className= {className + " flex flex-col items-center w-full overflow-hidden" }>
            {vectors !== null ? (
                <div className="flex flex-col w-full justify-center overflow-clip">
                    <ComparativeSpeedPlot timeUnit={timeUnit} data={plotVelocityData} />
                    <ComparativeAccelerationPlot timeUnit={timeUnit} data={plotAccelerationData} />
                </div>
            ) : (
                <div className="w-full h-full flex items-center justify-center">
                    <OrbitProgress size='large' color="#EFE2E2" variant='dotted' />
                </div>
            )}
        </div>
    );
}
