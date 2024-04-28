import React, { useState, useEffect, useMemo } from "react";
import { useVectorsContext } from "../../context/VectorsContext";
import BasePlot from "./BasePlot";
import {OrbitProgress} from "react-loading-indicators";

export default function ComparativeSpeedPlot({ className, timeUnit, trajectoryData, trajectorySecondaryData, currentDriver, currentSecondaryDriver, currentLap }) {
    const { vectors } = useVectorsContext();
    const [visible, setVisible] = useState([true, true]);

    function handleUpdate(state) {
        if (state.data[0].visible !== visible[0] || state.data[1].visible !== visible[1])
            setVisible([state.data[0].visible, state.data[1].visible])
    }

    const plotTrajectoryData = useMemo(() => {
        let data = [];
        if (trajectoryData && vectors) {
            data.push({
                x: trajectoryData.map(it => it.intrinsic.s / 10),
                y: vectors.map(it => it.velocity.speedometer / 10),
                type: 'scatter',
                mode: 'lines',
                marker: { color: 'red' },
                hoverinfo: 'none',
                name: 'Conductor ' + currentDriver.fullName
            })
        }

        if (trajectorySecondaryData && vectors) {
            data.push({
                x: trajectorySecondaryData.map(it => it.intrinsic.s / 10),
                y: vectors.map(it => it.velocity.speedometer / 10),
                type: 'scatter',
                mode: 'lines',
                marker: { color: 'yellow' },
                hoverinfo: 'none',
                name: 'Conductor ' + currentSecondaryDriver.fullName
            })
        }
        return data;
    }, [trajectoryData, trajectorySecondaryData, vectors]);


    const plotLayout = useMemo(() => {
        const yAxisFont = {
            size: 17
        }
        return {
            xaxis: {
                title: 'Distancia (m)', tolerance: 0.1
            },
            yaxis: {
                title: 'Velocidad [m/s]', titlefont: yAxisFont, tolerance: 0.1
            },
            margin: { t: 20 },
        }
    }, [timeUnit]);

    return (
        <div>
            {vectors !== null && plotTrajectoryData !== null ?
                <BasePlot
                    className={className + " flex p-0"}
                    data={plotTrajectoryData}
                    layout={plotLayout}
                    config={{ responsive: true, scrollZoom: true, displayModeBar: false }}
                    onUpdate={handleUpdate}
                />
                :
                <>
                    <div className="w-full h-full flex items-center justify-center"><OrbitProgress size='large'
                        color="#EFE2E2"
                        variant='dotted' />
                    </div>
                </>
            }
        </div>
    );
}
