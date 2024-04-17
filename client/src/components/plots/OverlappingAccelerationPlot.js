import Plot from 'react-plotly.js';
import {useResizeDetector} from 'react-resize-detector';
import {plotStyles} from "../../styles";
import {enforcePlotRange} from "./plot-utils";
import {useMemo, useState} from "react";

export default function OverlappingAccelerationPlot({className, timeUnit, traces}) {
    const {moduleTrace, tangentialTrace, normalTrace} = traces;
    const {width, height, ref} = useResizeDetector();

    const minX = useMemo(() => (moduleTrace && tangentialTrace && normalTrace)  ? Math.min(...moduleTrace.x, ...tangentialTrace.x, ...normalTrace.x) : null, [moduleTrace, tangentialTrace, normalTrace]);
    const minY = useMemo(() => (moduleTrace && tangentialTrace && normalTrace) ? Math.min(...moduleTrace.y, ...tangentialTrace.y, ...normalTrace.y) : null, [moduleTrace, tangentialTrace, normalTrace]);
    const maxX = useMemo(() => (moduleTrace && tangentialTrace && normalTrace) ? Math.max(...moduleTrace.x, ...tangentialTrace.x, ...normalTrace.x) : null, [moduleTrace, tangentialTrace, normalTrace]);
    const maxY = useMemo(() => (moduleTrace && tangentialTrace && normalTrace) ? Math.max(...moduleTrace.y, ...tangentialTrace.y, ...normalTrace.y) : null, [moduleTrace, tangentialTrace, normalTrace]);

    const xTolerance = (maxX - minX) * 0.05;
    const yTolerance = (maxY - minY) * 0.05;

    const [range, setRange] = useState({
        x0: minX,
        x1: maxX,
        y0: minY,
        y1: maxY
    });

    const [visible, setVisible] = useState([true, true, true]);


    function handleUpdate(state) {
        if (state.layout.xaxis.range[0] !== range.x0 || state.layout.xaxis.range[1] !== range.x1 ||
            state.layout.yaxis.range[0] !== range.y0 || state.layout.yaxis.range[1] !== range.y1) {
            const newRange = {
                x0: state.layout.xaxis.range[0],
                x1: state.layout.xaxis.range[1],
                y0: state.layout.yaxis.range[0],
                y1: state.layout.yaxis.range[1]
            }
            setRange(enforcePlotRange(range, newRange, minX - xTolerance, minY - yTolerance, maxX + xTolerance, maxY + yTolerance));
        }
        if(state.data[0].visible !== visible[0] || state.data[1].visible !== visible[1] || state.data[2].visible !== visible[2])
            setVisible([state.data[0].visible, state.data[1].visible, state.data[2].visible])
    }

    const plotLayout = useMemo(() => {
            return {
                plot_bgcolor: plotStyles.plot_bgcolor,
                paper_bgcolor: plotStyles.paper_bgcolor,
                font: plotStyles.font,

                xaxis: {
                    title: 'Tiempo [' + timeUnit + "]",
                    color: plotStyles.axisColor,
                    gridcolor: plotStyles.gridColor,
                    gridwidth: 1,
                    range: [range.x0, range.x1],
                },
                yaxis: {
                    title: 'Aceleración [m/s²]',
                    color: plotStyles.axisColor,
                    gridcolor: plotStyles.gridColor,
                    gridwidth: 1,
                    range: [range.y0, range.y1],
                },
                responsive: true,
                dragmode: "pan",
                width: width,
                height: height,
                autosize: true,
                margin: {t: 20},
            }
        }
        , [timeUnit, range, width, height]);


    return (
        <div ref={ref} className={className + " flex p-0"}>
            <Plot
                className="w-full h-full"
                data={[
                    {...moduleTrace, xaxis: 'x1', yaxis: 'y1', name: "Módulo", visible: visible[0]},
                    {...tangentialTrace, xaxis: 'x1', yaxis: 'y1', name: "Tangencial", visible: visible[1]},
                    {...normalTrace, xaxis: 'x1', yaxis: 'y1', name: "Normal", visible: visible[2]},

                ]}
                layout={plotLayout}
                config={{responsive: true, scrollZoom: true, displayModeBar: false}}
                onUpdate={handleUpdate}
            />
        </div>
    )
}
