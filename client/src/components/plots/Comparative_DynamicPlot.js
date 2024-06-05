import React, { useState, useMemo } from "react";
import { useKinematicVectorsContext } from "../../context/KinematicVectorsContext";
import BasePlot from "./BasePlot";
import { OrbitProgress } from "react-loading-indicators";
import { plotStyles, primaryDriverColor, secondaryDriverColor } from "../../styles";

export default function Comparative_DynamicPlot({ className, trajectoryData, trajectorySecondaryData, currentDriver, currentSecondaryDriver,
                                                    selectedOption}) {
    const { vectors } = useKinematicVectorsContext();
    const [visible, setVisible] = useState([true, true]);

    function handleUpdate(state) {
        if (state.data[0].visible !== visible[0] || state.data[1].visible !== visible[1])
            setVisible([state.data[0].visible, state.data[1].visible])
    }

    const plotData = useMemo(() => {
        const accelerationFunctions = {
            module: (it) => it.acceleration.module / 10,
            tangential: (it) => it.acceleration.aTangential / 10,
            normal: (it) => it.acceleration.aNormal / 10
        };

        const getAccelerationType = (option) => {
            const accelerationFunction = accelerationFunctions[option];
            if (accelerationFunction) {
                return accelerationFunction;
            } else {
                return (it) => it.acceleration.module / 10;
            }
        };

        const accelerationData = vectors.map(getAccelerationType(selectedOption));

        if (trajectoryData && trajectorySecondaryData && vectors) {
            const primaryDriverData = {
                x: trajectoryData.map(it => it.intrinsic.s / 10),
                y: accelerationData,
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
                y: accelerationData,
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
                ? [primaryDriverData, { ...primaryDriverData,y: accelerationData, xaxis: 'x1', yaxis: 'y1', showlegend: false }]
                : [primaryDriverData, secondaryDriverData,
                    { ...primaryDriverData, y: accelerationData, xaxis: 'x1', yaxis: 'y1', showlegend: false },
                    { ...secondaryDriverData, y: accelerationData, xaxis: 'x1', yaxis: 'y1', showlegend: false }];
        }
    }, [trajectoryData, trajectorySecondaryData, vectors, currentDriver, currentSecondaryDriver, visible, selectedOption]);

    const getYAxisTitle = (selectedOption) => {
        switch (selectedOption) {
            case 'tangential':
                return 'a tangencial [m/s²]';
            case 'normal':
                return 'a normal [m/s²]';
            default:
                return '|a| [m/s²]';
        }
    };

    const plotLayout = useMemo(() => {
        const xAxisFont = {
            family: plotStyles.font.family,
            size: 18,
            color: plotStyles.font.color
        }

        const yAxisFont = {
            family: plotStyles.font.family,
            size: 16,
            color: plotStyles.font.color
        }
        const yaxisTitle = getYAxisTitle(selectedOption);

        return {
            xaxis: {
                title: 'Distancia (m)', titlefont: xAxisFont, tolerance: 0.1
            },
            yaxis: {
                title: yaxisTitle, titlefont: yAxisFont, tolerance: 0.1
            },
            grid: { rows: 1, columns: 1, pattern: 'independent' },
            dragmode: "pan",
            margin: { t: 20 },
        }
    }, [selectedOption]);

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
