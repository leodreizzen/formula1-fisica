import {useMemo, useState} from "react";
import BasePlot from "./BasePlot";

export default function OverlappingFrictionsPlot({className, timeUnit, traces, maxFrictionValue, coefficientValue}) {
    const {moduleTrace, tangentialTrace, normalTrace} = traces;
    const [visible, setVisible] = useState([true, true, true]);

    function handleUpdate(state) {
        if (state.data[0].visible !== visible[0] || state.data[1].visible !== visible[1] || state.data[2].visible !== visible[2])
            setVisible([state.data[0].visible, state.data[1].visible, state.data[2].visible])
    }

    const plotLayout = useMemo(() => {
        return {
            xaxis: {
                title: 'Tiempo [' + timeUnit + "]", tolerance: 0.1
            },
            yaxis: {
                title: 'Rozamiento [N]', tolerance: 0.1
            },
            margin: {t: 20},
            shapes: [
                {
                    type: 'line',
                    xref: 'paper',
                    x0: 0,
                    y0: maxFrictionValue,
                    x1: 1,
                    y1: maxFrictionValue,
                    line: {
                        color: 'lightblue',
                        width: 2,
                        dash: 'dashdot',
                    },
                },
            ],
            annotations: [
                {
                    xref: 'paper',
                    yref: 'paper',
                    x: 0.5,
                    y: 1.02,
                    xanchor: 'center',
                    yanchor: 'top',
                    text: 'Rozamiento máximo: ' + maxFrictionValue + " N",
                    textposition: "top",
                    showarrow: false,
                    font: {
                        size: 16,
                        color: 'lightblue',
                    }

                },
                 {
                    xref: 'paper',
                    yref: 'paper',
                    x: 0.5,
                    y: 0.97,
                    xanchor: 'center',
                    yanchor: 'top',
                    text: 'Coeficiente estático: ' + coefficientValue.toFixed(4),
                    textposition: "top",
                    showarrow: false,
                    font: {
                        size: 16,
                        color: 'white',
                    }

                },
            ],
        }
    }, [timeUnit]);

    return (
        <BasePlot
            className={className + " flex p-0"}
            data={[
                {...moduleTrace, xaxis: 'x1', yaxis: 'y1', name: "Módulo", visible: visible[0]},
                {...tangentialTrace, xaxis: 'x1', yaxis: 'y1', name: "Tangencial", visible: visible[1]},
                {...normalTrace, xaxis: 'x1', yaxis: 'y1', name: "Normal", visible: visible[2]},
            ]}
            layout={plotLayout}
            config={{responsive: true, scrollZoom: true, displayModeBar: false}}
            onUpdate={handleUpdate}
        />
    )
}