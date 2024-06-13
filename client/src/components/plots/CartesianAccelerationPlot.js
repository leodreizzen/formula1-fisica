import {plotStyles} from "../../styles";
import {useMemo} from "react";
import {timeDeltaToTimeUnit} from "../../client-util";
import BasePlot from "./BasePlot";

export default function CartesianAccelerationPlot({ className, timeUnit, vectors }) {
    const plotData = useMemo(() => {
        let data = [];
        if (vectors) {
            data.push({
                x: vectors.map(it => timeDeltaToTimeUnit(it.time, timeUnit)),
                y: vectors.map(it => it.acceleration.aX / 10),
                type: 'scatter',
                mode: 'lines',
                marker: { color: 'red' },
                xaxis: 'x1', yaxis: 'y1', showlegend: false, name: ""
            })
            data.push({
                x: vectors.map(it => timeDeltaToTimeUnit(it.time, timeUnit)),
                y: vectors.map(it => it.acceleration.aY / 10),
                type: 'scatter',
                mode: 'lines',
                marker: { color: 'orange' },
                xaxis: 'x2', yaxis: 'y2', showlegend: false, name: ""
            })
            data.push({
                x: vectors.map(it => timeDeltaToTimeUnit(it.time, timeUnit)),
                y: vectors.map(it => it.acceleration.aZ / 10),
                type: 'scatter',
                mode: 'lines',
                marker: {color: 'blue'},
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
                title: "",
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
                title: 'Ax [m/s²]',
                titlefont: yAxisFont,
                tolerance: 0.1
            },
            yaxis2: {
                title: 'Ay [m/s²]',
                titlefont: yAxisFont,
                tolerance: 0.1,
                tickfont: yAxisFont,
                rangemode: 'tozero',
            },
            yaxis3: {
                title: 'Az [m/s²]',
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