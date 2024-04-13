import Plot from 'react-plotly.js';
import { useResizeDetector } from 'react-resize-detector';
import {plotStyles} from "../styles";

export default function OverlappingAccelerationPlot({className, isDataLoading, accelerationData, timeUnit, traces}) {
    const {moduleTrace, tangentialTrace, normalTrace} = traces;
    const { width, height, ref } = useResizeDetector();

    return (
        <div ref={ref} className={className + " flex h-full p-0"}>
            <Plot
                data={[
                    {...moduleTrace, xaxis: 'x1', yaxis: 'y1', name: "Módulo"},
                    {...tangentialTrace, xaxis: 'x1', yaxis: 'y1', name: "Tangencial"},
                    {...normalTrace, xaxis: 'x1', yaxis: 'y1', name: "Normal"},

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
                    yaxis: {title: 'Aceleración [m/s²]',
                        color: plotStyles.axisColor,
                        gridcolor: plotStyles.gridColor,
                        gridwidth: 1,
                    },
                    responsive: true,
                    dragmode: "pan",
                    width: width,
                    height: height,
                    autosize:true,
                    margin: {t:20},
                }}
                config={{responsive: true, scrollZoom: true, displayModeBar: false}}
            />
        </div>
    )
}
