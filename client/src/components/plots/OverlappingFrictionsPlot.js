import {useMemo, useState} from "react";
import BasePlot from "./BasePlot";

export default function OverlappingFrictionsPlot({className, timeUnit, traces}) {
    const {moduleTrace, tangentialTrace, normalTrace, staticCoefficientTrace} = traces;
    const [visible, setVisible] = useState([true, true, true, true]);

    function handleUpdate(state) {
        if(state.data[0].visible !== visible[0] || state.data[1].visible !== visible[1] || state.data[2].visible !== visible[2] || state.data[3].visible !== visible[3])
            setVisible([state.data[0].visible, state.data[1].visible, state.data[2].visible, state.data[3].visible])
    }

    const plotLayout = useMemo(() => {
            return {
                xaxis: {
                    title: 'Tiempo [' + timeUnit + "]", tolerance: 0.1
                },
                yaxis: {
                    title: 'Rozamiento [N]', tolerance:0.1
                },
                margin: {t: 20},
            }
        }, [timeUnit]);

    return (
        <BasePlot
            className={className + " flex p-0"}
            data={[
                {...moduleTrace, xaxis: 'x1', yaxis: 'y1', name: "Módulo", visible: visible[0]},
                {...tangentialTrace, xaxis: 'x1', yaxis: 'y1', name: "Tangencial", visible: visible[1]},
                {...normalTrace, xaxis: 'x1', yaxis: 'y1', name: "Normal", visible: visible[2]},
                {...staticCoefficientTrace, xaxis: 'x1', yaxis: 'y1', name: "Estatico", visible: visible[3]},
            ]}
            layout={plotLayout}
            config={{responsive: true, scrollZoom: true, displayModeBar: false}}
            onUpdate={handleUpdate}
        />
    )
}