import Plot from 'react-plotly.js';
import {useResizeDetector} from 'react-resize-detector';
import {light} from "@mui/material/styles/createPalette";
import {plotStyles} from "../styles";

function SplitAccelerationPlot({className, timeUnit, traces}) {
    const {moduleTrace, tangentialTrace, normalTrace} = traces;
    const {width, height, ref} = useResizeDetector();
    return (
        <div ref={ref} className={className + " flex p-0"}>
            <Plot className="w-full h-full"
                data={[
                    {...moduleTrace, showlegend: false, xaxis: 'x1', yaxis: 'y1'},
                    {...tangentialTrace, xaxis: 'x2', yaxis: 'y2', showlegend: false},
                    {...normalTrace, xaxis: 'x3', yaxis: 'y3', showlegend: false},
                ]}
                layout={{
                    plot_bgcolor:plotStyles.plot_bgcolor,
                    paper_bgcolor: plotStyles.paper_bgcolor,
                    font: plotStyles.font,

                    xaxis: {
                        title: 'Tiempo [' + timeUnit + "]",
                        color: plotStyles.axisColor,
                        gridcolor: plotStyles.gridColor,
                        gridwidth: 1,
                    },
                    xaxis2: {
                        title: 'Tiempo [' + timeUnit + "]",
                        color: plotStyles.axisColor,
                        gridcolor: plotStyles.gridColor,
                        gridwidth: 1,
                    },
                    xaxis3: {
                        title: 'Tiempo [' + timeUnit + "]",
                        color: plotStyles.axisColor,
                        gridcolor: plotStyles.gridColor,
                        gridwidth: 1,
                    },

                    yaxis1: {
                        title: '|a| [m/s²]',
                        color: plotStyles.axisColor,
                        gridcolor: plotStyles.gridColor,
                        gridwidth: 1,
                    },
                    yaxis2: {
                        title: 'a tangencial [m/s²]',
                        color: plotStyles.axisColor,
                        gridcolor: plotStyles.gridColor,
                        gridwidth: 1,
                    },
                    yaxis3: {
                        title: 'a normal [m/s²]',
                        color: plotStyles.axisColor,
                        gridcolor: plotStyles.gridColor,
                        gridwidth: 1,
                    },
                    margin: {t: 20},


                    grid: {rows: 3, columns: 1, pattern: 'independent'},
                    width: width,
                    height: height,
                    autosize: true,
                    dragmode: "pan"
                }}
                config={{responsive: true, scrollZoom: true, displayModeBar: false}}
            />
        </div>
    )
}

export default SplitAccelerationPlot;