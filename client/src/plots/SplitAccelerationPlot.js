import Plot from 'react-plotly.js';
import { useResizeDetector } from 'react-resize-detector';


function SplitAccelerationPlot({className, timeUnit, traces}) {
    const {moduleTrace, tangentialTrace, normalTrace} = traces;
    const { width, height, ref } = useResizeDetector();
    return (
        <div ref={ref} className={className + " flex h-full p-0"}>
            <Plot
                data={[
                    {...moduleTrace, showlegend: false, xaxis: 'x1', yaxis: 'y1'},
                    {...tangentialTrace, xaxis: 'x2', yaxis: 'y2', showlegend: false},
                    {...normalTrace, xaxis: 'x3', yaxis: 'y3', showlegend: false},
                ]}
                layout={{
                    title:'Aceleraciones en función del tiempo',
                    xaxis: {title: 'Tiempo [' + timeUnit + "]"},
                    xaxis2: {title: 'Tiempo [' + timeUnit + "]"},
                    xaxis3: {title: 'Tiempo [' + timeUnit + "]"},

                    yaxis1: {title: '|a| [m/s²]'},
                    yaxis2: {title: 'a tangencial [m/s²]'},
                    yaxis3: {title: 'a normal [m/s²]'},


                    grid: { rows: 3, columns: 1, pattern: 'independent'},
                    width: width,
                    height: height,
                    autosize:true,
                }}
                config={{responsive: true, scrollZoom: true}}
            />
        </div>
    )
}

export default SplitAccelerationPlot;