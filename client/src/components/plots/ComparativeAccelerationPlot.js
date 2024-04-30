import { useState, useMemo } from "react";
import BasePlot from "./BasePlot";

export default function ComparativeAccelerationPlot({ className, timeUnit, data }) {

    const [visible, setVisible] = useState([true, true]);

    function handleUpdate(state) {
        if (state.data[0].visible !== visible[0] || state.data[1].visible !== visible[1])
            setVisible([state.data[0].visible, state.data[1].visible])
    }

    const plotLayout = useMemo(() => {
        const yAxisFont = {
            size: 17
        }
        return {
            xaxis: {
                title: 'Distancia (m)', tolerance: 0.1
            },
            yaxis: {
                title: '|a| [m/s²]', titlefont: yAxisFont, tolerance: 0.1
            },
            margin: { t: 20 },
        }
    }, [timeUnit]);

    return (
        <div>
            <BasePlot
                className={className + " h-80 p-10"}
                data={data}
                layout={plotLayout}
                config={{ responsive: true, scrollZoom: true, displayModeBar: false }}
                onUpdate={handleUpdate} />
        </div>
    );
}