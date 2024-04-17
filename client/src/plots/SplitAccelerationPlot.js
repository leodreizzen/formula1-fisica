import Plot from 'react-plotly.js';
import {useResizeDetector} from 'react-resize-detector';
import {plotStyles} from "../styles";
import {useMemo, useState} from "react";
import {enforcePlotSingleAxisRange} from "./plot-utils";

function SplitAccelerationPlot({className, timeUnit, traces}) {
    const {moduleTrace, tangentialTrace, normalTrace} = traces;
    const {width, height, ref} = useResizeDetector();

    //Memos to avoid re-rendering
    const minX = useMemo(() => Math.min(...moduleTrace.x), [moduleTrace]);
    const maxX = useMemo(() => Math.max(...moduleTrace.x), [moduleTrace]);
    const minY1 = useMemo(() => Math.min(...moduleTrace.y), [moduleTrace]);
    const maxY1 = useMemo(() => Math.max(...moduleTrace.y), [moduleTrace]);
    const minY2 = useMemo(() => Math.min(...tangentialTrace.y), [tangentialTrace]);
    const maxY2 = useMemo(() => Math.max(...tangentialTrace.y), [tangentialTrace]);
    const minY3 = useMemo(() => Math.min(...normalTrace.y), [normalTrace]);
    const maxY3 = useMemo(() => Math.max(...normalTrace.y), [normalTrace]);

    const [xRange, setXRange] = useState([minX, maxX]);
    const [y1Range, setY1Range] = useState([minY1, maxY1]);
    const [y2Range, setY2Range] = useState([minY2, maxY2]);
    const [y3Range, setY3Range] = useState([minY3, maxY3]);


    function handleUpdate(state) {
        const newXRange = state.layout.xaxis.range;
        const newY1Range = state.layout.yaxis.range;
        const newY2Range = state.layout.yaxis2.range;
        const newY3Range = state.layout.yaxis3.range;

        if (newXRange[0] !== xRange[0] || newXRange[1] !== xRange[1])
            setXRange(enforcePlotSingleAxisRange(xRange, newXRange, minX, maxX));
        if (newY1Range[0] !== y1Range[0] || newY1Range[1] !== y1Range[1])
            setY1Range(enforcePlotSingleAxisRange(y1Range, newY1Range, minY1, maxY1));
        if (newY2Range[0] !== y2Range[0] || newY2Range[1] !== y2Range[1])
            setY2Range(enforcePlotSingleAxisRange(y2Range, newY2Range, minY2, maxY2));
        if (newY3Range[0] !== y3Range[0] || newY3Range[1] !== y3Range[1])
            setY3Range(enforcePlotSingleAxisRange(y3Range, newY3Range, minY3, maxY3));
    }

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
            plot_bgcolor: plotStyles.plot_bgcolor,
            paper_bgcolor: plotStyles.paper_bgcolor,
            font: plotStyles.font,

            xaxis: {
                title: 'Tiempo [' + timeUnit + "]",
                color: plotStyles.axisColor,
                gridcolor: plotStyles.gridColor,
                gridwidth: 1,
                range: [xRange[0], xRange[1]],
                titlefont: xAxisFont
            },
            xaxis2: {
                anchor: 'x',
                matches: 'x',
                color: plotStyles.axisColor,
                gridcolor: plotStyles.gridColor,
                gridwidth: 1,
                title: 'Tiempo [' + timeUnit + "]",
                titlefont: xAxisFont
            },
            xaxis3: {
                anchor: 'x',
                matches: 'x',
                color: plotStyles.axisColor,
                gridcolor: plotStyles.gridColor,
                gridwidth: 1,
                title: 'Tiempo [' + timeUnit + "]",
                titlefont: xAxisFont
            },

            yaxis1: {
                title: '|a| [m/s²]',
                color: plotStyles.axisColor,
                gridcolor: plotStyles.gridColor,
                gridwidth: 1,
                range: [y1Range[0], y1Range[1]],
                titlefont: yAxisFont

            },
            yaxis2: {
                title: 'a tangencial [m/s²]',
                color: plotStyles.axisColor,
                gridcolor: plotStyles.gridColor,
                gridwidth: 1,
                range: [y2Range[0], y2Range[1]],
                titlefont: yAxisFont

            },
            yaxis3: {
                title: 'a normal [m/s²]',
                color: plotStyles.axisColor,
                gridcolor: plotStyles.gridColor,
                gridwidth: 1,
                range: [y3Range[0], y3Range[1]],
                titlefont: yAxisFont

            },
            margin: {t: 20},


            grid: {rows: 3, columns: 1, pattern: 'independent'},
            width: width,
            height: height,
            autosize: true,
            dragmode: "pan"
        }
    }, [timeUnit, width, height, xRange, y1Range, y2Range, y3Range])

    return (
        <div ref={ref} className={className + " flex p-0"}>
            <Plot className="w-full h-full"
                  data={[
                      {...moduleTrace, xaxis: 'x1', yaxis: 'y1', showlegend: false, name:""},
                      {...tangentialTrace, xaxis: 'x2', yaxis: 'y2', showlegend: false, name:""},
                      {...normalTrace, xaxis: 'x3', yaxis: 'y3', showlegend: false, name:""},
                  ]}
                  layout={plotLayout}
                  config={{responsive: true, scrollZoom: true, displayModeBar: false}}
                  onUpdate={handleUpdate}
            />
        </div>
    )
}

export default SplitAccelerationPlot;