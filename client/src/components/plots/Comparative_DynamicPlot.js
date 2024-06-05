import React, { useState, useMemo } from "react";
import BasePlot from "./BasePlot";
import { OrbitProgress } from "react-loading-indicators";
import { plotStyles, primaryDriverColor, secondaryDriverColor } from "../../styles";
import {useDynamics} from "../../api/hooks";

export default function Comparative_DynamicPlot({ className, trajectoryData, trajectorySecondaryData, currentDriver, currentSecondaryDriver,
                                                    selectedOption}) {
    const { dynamicData } = useDynamics(currentDriver.year, currentDriver.round, currentDriver.session, currentDriver.driverNumber, currentDriver.lapNumber);
    const { dynamicSecondaryData } = useDynamics(currentDriver.year, currentDriver.round, currentDriver.session, currentDriver.driverNumber, currentDriver.lapNumber);

    const [visible, setVisible] = useState([true, true]);

    function handleUpdate(state) {
        if (state.data[0].visible !== visible[0] || state.data[1].visible !== visible[1])
            setVisible([state.data[0].visible, state.data[1].visible])
    }

    const plotData = useMemo(() => {
        const frictionsFunctions = {
            module: (it) => it.friction.module / 10,
            tangential: (it) => it.friction.tangential / 10,
            normal: (it) => it.friction.normal / 10
        };

        const getFrictionsType = (option) => {
            const accelerationFunction = frictionsFunctions[option];
            if (accelerationFunction) {
                return accelerationFunction;
            } else {
                throw new Error("Wrong friction option")
            }
        };

        const frictionsData = data.forces.map(getFrictionsType(selectedOption));

        if (trajectoryData && trajectorySecondaryData && vectors) {
            const primaryDriverData = {
                x: trajectoryData.map((it, index) => index / 10),
                y: frictionsData,
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
                x: Array.from({length: secondaryDynamics.length}, (_, i) => i + 1),

                y: frictionsData,
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
                ? [primaryDriverData, { ...primaryDriverData,y: frictionsData, xaxis: 'x1', yaxis: 'y1', showlegend: false }]
                : [primaryDriverData, secondaryDriverData,
                    { ...primaryDriverData, y: frictionsData, xaxis: 'x1', yaxis: 'y1', showlegend: false },
                    { ...secondaryDriverData, y: frictionsData, xaxis: 'x1', yaxis: 'y1', showlegend: false }];
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
