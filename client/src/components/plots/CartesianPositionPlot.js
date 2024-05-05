import {plotStyles} from "../../styles";
import {useMemo} from "react";
import {timeDeltaToTimeUnit} from "../../client-util";
import BasePlot from "./BasePlot";

function CartesianPositionPlot({className, timeUnit, trajectoryData}) {

    const plotData = useMemo(() => {
        let data = [];
        if(trajectoryData){
            data.push({
                x: trajectoryData.map(it => timeDeltaToTimeUnit(it.time, timeUnit)),
                y: trajectoryData.map(it => it.cartesian.x / 10),
                type: 'scatter',
                mode: 'lines',
                marker: {color: 'red'},
                xaxis: 'x1', yaxis: 'y1', showlegend: false, name:""
            })
            data.push({
                x: trajectoryData.map(it => timeDeltaToTimeUnit(it.time, timeUnit)),
                y: trajectoryData.map(it => it.cartesian.y / 10),
                type: 'scatter',
                mode: 'lines',
                marker: {color: 'orange'},
                xaxis: 'x2', yaxis: 'y2', showlegend: false, name:""
            })
            data.push({
                x: trajectoryData.map(it => timeDeltaToTimeUnit(it.time, timeUnit)),
                y: trajectoryData.map(it => it.cartesian.z / 10),
                type: 'scatter',
                mode: 'lines',
                marker: {color: 'blue'},
                xaxis: 'x3', yaxis: 'y3', showlegend: false, name:""
            })
        }
        return data;
    }, [trajectoryData, timeUnit]);

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
                title: 'X(m)',
                titlefont: yAxisFont,
                tolerance: 0.1

            },
            yaxis2: {
                title: 'Y(m)',
                titlefont: yAxisFont,
                tolerance: 0.1
            },
            yaxis3: {
                title: 'Z(m)',
                titlefont: yAxisFont,
                tolerance: 0.1
            },
            margin: {t: 20},
            grid: {rows: 3, columns: 1, pattern: 'independent'},
            dragmode: "pan"
        }
    }, [timeUnit])

    return (
         <BasePlot className={className}
             data={plotData}
             layout={plotLayout}
             config={{responsive: true, scrollZoom: true, displayModeBar: false}}
         />
    )
}

export default CartesianPositionPlot;