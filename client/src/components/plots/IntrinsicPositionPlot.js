import {useMemo} from "react";
import {timeDeltaToTimeUnit} from "../../client-util";
import {plotStyles, trajectoryColor} from "../../styles";
import BasePlot from "./BasePlot";

function IntrinsicPositionPlot({className, timeUnit, trajectoryData}) {

    const plotData = useMemo(() => {
        let data = [];
        if(trajectoryData){
            data.push({
                x: trajectoryData.map(it => timeDeltaToTimeUnit(it.time, timeUnit)),
                y: trajectoryData.map(it => it.intrinsic.s / 10),
                type: 'scatter',
                mode: 'lines',
                marker: {color: trajectoryColor},
                xaxis: 'x', yaxis: 'y', showlegend: false, name:"S(t)"
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
            yaxis: {
                title: 'S [t]',
                titlefont: yAxisFont,
                tolerance: 0.1

            },
            margin: {t: 20},
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

export default IntrinsicPositionPlot;