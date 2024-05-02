import React, { useState, useMemo } from "react";
import { useVectorsContext } from "../../context/VectorsContext";
import BasePlot from "./BasePlot";
import {OrbitProgress} from "react-loading-indicators";
import {plotStyles, primaryDriverColor, secondaryDriverColor} from "../../styles";

export default function ComparativePlots({ className, trajectoryData, trajectorySecondaryData, currentDriver, currentSecondaryDriver, currentLap }) {
    const { vectors } = useVectorsContext();
    const [visible, setVisible] = useState([true, true]);

    function handleUpdate(state) {
        if (state.data[0].visible !== visible[0] || state.data[1].visible !== visible[1])
            setVisible([state.data[0].visible, state.data[1].visible])
    }

    const plotData = useMemo(() => {
        if (trajectoryData && trajectorySecondaryData && vectors) {
            const primaryDriverData = {
                x: trajectoryData.map(it => it.intrinsic.s / 10),
                y: vectors.map(it => it.velocity.module / 10),
                type: 'scatter',
                mode: 'lines',
                marker: { color: primaryDriverColor },
                name: currentDriver.fullName,
                xaxis: 'x1', 
                yaxis: 'y1',
                visible: visible[0],
                legendgroup: currentDriver.fullName,
                showlegend: true
            };
    
            const secondaryDriverData = {
                x: trajectorySecondaryData.map(it => it.intrinsic.s / 10),
                y: vectors.map(it => it.velocity.module / 10),
                type: 'scatter',
                mode: 'lines',
                marker: { color: secondaryDriverColor },
                name: currentSecondaryDriver.fullName,
                xaxis: 'x1', 
                yaxis: 'y1',
                visible: visible[1],
                legendgroup: currentSecondaryDriver.fullName,
                showlegend: true
            };
    
            return currentDriver === currentSecondaryDriver
                ? [primaryDriverData, { ...primaryDriverData, y: vectors.map(it => it.acceleration.module / 10), xaxis: 'x2', yaxis: 'y2', showlegend: false }]
                : [primaryDriverData, secondaryDriverData, 
                    { ...primaryDriverData, y: vectors.map(it => it.acceleration.module / 10), xaxis: 'x2', yaxis: 'y2', showlegend: false },
                    { ...secondaryDriverData, y: vectors.map(it => it.acceleration.module / 10), xaxis: 'x2', yaxis: 'y2', showlegend: false }];
        }
    }, [trajectoryData, trajectorySecondaryData, vectors, currentDriver, currentSecondaryDriver, visible]);
    

    const plotLayout = useMemo(() => {
        const xAxisFont = {
            family: plotStyles.font.family,
            size:18,
            color: plotStyles.font.color
        }
    
        const yAxisFont = {
            family: plotStyles.font.family,
            size:16,
            color: plotStyles.font.color
        }
        return {
            xaxis: {
                title: '', tolerance: 0.1
            },
            yaxis: {
                title: 'Velocidad [m/s]', titlefont: yAxisFont, tolerance: 0.1
            },
            xaxis2: {
                title: 'Distancia (m)', titlefont: xAxisFont, tolerance: 0.1
            },
            yaxis2: {
                title: '|a| [m/s²]', titlefont: yAxisFont, tolerance: 0.1
            },
            grid: {rows: 2, columns: 1, pattern: 'independent'},
            dragmode: "pan",
            margin: { t: 20 },
        }
    }, []);

    

    return (
        <div className={className + " flex justify-center w-full overflow-clip"}>
            {vectors !== null ?
                <BasePlot
                    className={className + " flex justify-center w-full"}
                    data={plotData}
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
