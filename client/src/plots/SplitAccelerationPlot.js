import Plot from 'react-plotly.js';
import {OrbitProgress} from "react-loading-indicators";
import {dateUTC_to_timeUnit} from "../client-util"
import { useResizeDetector } from 'react-resize-detector';


function SplitAccelerationPlot({className, isDataLoading, accelerationData, timeUnit, size}) {
    const { width, height, ref } = useResizeDetector();
    console.log(width, height)
    let moduleTrace = {
        x: Number(dateUTC_to_timeUnit(accelerationData.map(it => it.time), timeUnit)),
        y: accelerationData.map(it => it.acceleration.module / 10),
        type: 'scatter',
        mode: 'lines',
        marker: {color: 'red'},
    };
    let tangentialTrace = {
        x: Number(dateUTC_to_timeUnit(accelerationData.map(it => it.time), timeUnit)),
        y: accelerationData.map(it => it.acceleration.aTangential / 10),
        type: 'scatter',
        mode: 'lines',
        marker: {color: 'orange'},
    };
    let normalTrace = {
        x: Number(dateUTC_to_timeUnit(accelerationData.map(it => it.time), timeUnit)),
        y: accelerationData.map(it => it.acceleration.aNormal / 10),
        type: 'scatter',
        mode: 'lines',
        marker: {color: 'blue'},
    };
    return (
        <div ref={ref} className={className + " flex h-full p-0"}>
            {isDataLoading ? <OrbitProgress/> :
                accelerationData !== null ?
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
                    :null}
        </div>
    )
}

export default SplitAccelerationPlot;