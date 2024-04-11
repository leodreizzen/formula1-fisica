import Plot from 'react-plotly.js';
import {OrbitProgress} from "react-loading-indicators";
import {dateUTC_to_timeUnit} from "../client-util"

export default function AccelerationPlot({className, isDataLoading, accelerationData, timeUnit}) {
    return (
        <div>
            {isDataLoading ? <OrbitProgress/> :
                accelerationData !== null ?
                    <Plot
                        data={[
                            {
                                x: Number(dateUTC_to_timeUnit(accelerationData.map(it => it.time), "min")),
                                y: accelerationData.map(it => it.acceleration.module),
                                type: 'scatter',
                                mode: 'lines',
                                marker: {color: 'red'},
                            }
                        ]}
                        layout={{width: 600, height: 600, title:'Aceleración en función del tiempo'}}
                    />
                    : null}
        </div>
    )
}

/* .replace(".", ",") */