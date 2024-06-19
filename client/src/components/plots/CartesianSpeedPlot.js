import {plotStyles, primaryGraphColor, secondaryGraphColor, thirdGraphColor} from "../../styles";
import {useMemo} from "react";
import {timeDeltaToTimeUnit} from "../../client-util";
import BasePlot from "./BasePlot";

export default function CartesianSpeedPlot({ className, timeUnit, vectors }) {
    const plotData = useMemo(() => {
        let data = [];
        if (vectors) {
            data.push({
                x: vectors.map(it => timeDeltaToTimeUnit(it.time, timeUnit)),
                y: vectors.map(it => it.velocity.vX / 10),
                type: 'scatter',
                mode: 'lines',
                marker: { color: primaryGraphColor },
                xaxis: 'x1', yaxis: 'y1', showlegend: false, name: ""
            })
            data.push({
                x: vectors.map(it => timeDeltaToTimeUnit(it.time, timeUnit)),
                y: vectors.map(it => it.velocity.vY / 10),
                type: 'scatter',
                mode: 'lines',
                marker: { color: secondaryGraphColor },
                xaxis: 'x2', yaxis: 'y2', showlegend: false, name: ""
            })
            data.push({
                x: vectors.map(it => timeDeltaToTimeUnit(it.time, timeUnit)),
                y: vectors.map(it => it.velocity.vZ / 10),
                type: 'scatter',
                mode: 'lines',
                marker: {color: thirdGraphColor},
                xaxis: 'x3', yaxis: 'y3', showlegend: false, name:""
            })
        }
        return data;
    }, [vectors, timeUnit]);

    const plotLayout = useMemo(() => {
        const xAxisFont = {
            family: plotStyles.font.family,
            size: 18,
            color: plotStyles.font.color
        };

        const yAxisFont = {
            family: plotStyles.font.family,
            size: 16,
            color: plotStyles.font.color
        };

        return {
            xaxis: {
                title: 'Tiempo [' + timeUnit + "]",
                titlefont: xAxisFont,
                tolerance: 0.1
            },
            xaxis2: {
                anchor: 'x',
                matches: 'x',
                title: 'Tiempo [' + timeUnit + "]",
                titlefont: xAxisFont,
                tolerance: 0.1
            },
            xaxis3: {
                anchor: 'x',
                matches: 'x',
                title: 'Tiempo [' + timeUnit + "]",
                titlefont: xAxisFont,
                tolerance: 0.1
            },
            yaxis1: {
                title: 'Vx [m/s]',
                titlefont: yAxisFont,
                tolerance: 0.1
            },
            yaxis2: {
                title: 'Vy [m/s]',
                titlefont: yAxisFont,
                tolerance: 0.1,
                tickfont: yAxisFont,
                rangemode: 'tozero',
            },
            yaxis3: {
                title: 'Vz [m/s]',
                titlefont: yAxisFont,
                tolerance: 0.1
            },
            margin: { t: 20 },
            grid: { rows: 3, columns: 1, pattern: 'independent' },
            dragmode: "pan"
        };
    }, [timeUnit]);

    return (
        <BasePlot className={className}
                    data={plotData}
                    layout={plotLayout}
                    config={{ responsive: true, scrollZoom: true, displayModeBar: false }}
        />
    );

}