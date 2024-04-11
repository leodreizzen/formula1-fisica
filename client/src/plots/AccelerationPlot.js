import Plot from 'react-plotly.js';
import {OrbitProgress} from "react-loading-indicators";
import {dateUTC_to_timeUnit} from "../client-util"

export default function AccelerationPlot({className, isDataLoading, accelerationData, timeUnit}) {
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

                            {...moduleTrace, showlegend: false, xaxis: 'x2', yaxis: 'y2'},
                            {...tangentialTrace, xaxis: 'x3', yaxis: 'y3', showlegend: false},
                            {...normalTrace, xaxis: 'x4', yaxis: 'y4', showlegend: false},

                        ]}
                        layout={{
                            width: 1000, height: 1400,
                            title:'Aceleraciones en función del tiempo',
                            xaxis: {title: 'Tiempo [' + timeUnit + "]"},
                            xaxis2: {title: 'Tiempo [' + timeUnit + "]"},
                            xaxis3: {title: 'Tiempo [' + timeUnit + "]"},
                            xaxis4: {title: 'Tiempo [' + timeUnit + "]"},

                            yaxis2: {title: 'a [m/s²]'},
                            yaxis3: {title: 'a tangencial [m/s²]'},
                            yaxis4: {title: 'a normal [m/s²]'},

                            grid: { rows: 4, columns: 1 },

                    }
                    }
                    />
                    :null}
        </div>
    )
}
