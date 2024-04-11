import Plot from 'react-plotly.js';
import {OrbitProgress} from "react-loading-indicators";
import {dateUTC_to_timeUnit} from "../client-util"

export default function OverlappingAccelerationPlot({className, isDataLoading, accelerationData, timeUnit}) {
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
        <div >
            {isDataLoading ? <OrbitProgress/> :
                accelerationData !== null ?
                    <Plot
                        data={[
                            {...moduleTrace, xaxis: 'x1', yaxis: 'y1', name: "Módulo"},
                            {...tangentialTrace, xaxis: 'x1', yaxis: 'y1', name: "Tangencial"},
                            {...normalTrace, xaxis: 'x1', yaxis: 'y1', name: "Normal"},

                        ]}
                        layout={{
                            title:'Aceleraciones en función del tiempo',
                            xaxis: {title: 'Tiempo [' + timeUnit + "]"},
                            responsive: true
                        }}
                    />
                    :null}
        </div>
    )
}
