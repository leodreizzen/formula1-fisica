import Plot from 'react-plotly.js';
import {useGetTrajectory} from "../api/hooks";
import {OrbitProgress} from "react-loading-indicators";

export default function TrajectoryPlot({className, sessionData, currentDriver: selectedDriver, currentLap}) {
    const year = sessionData === null ? null : sessionData.year;
    const roundNumber = sessionData === null ? null : sessionData.round;
    const sessionNumber = sessionData === null ? null : sessionData.session;

    const [trajectoryData, trajectoryDataLoading] = useGetTrajectory(year, roundNumber, sessionNumber, selectedDriver, currentLap);
    return (
        <div>
            {trajectoryDataLoading ? <OrbitProgress/> :
                trajectoryData !== null ?
                    <Plot
                        data={[
                            {
                                x: trajectoryData.map(it => it.x / 10),
                                y: trajectoryData.map(it => it.y / 10),
                                type: 'scatter',
                                mode: 'lines',
                                marker: {color: '#00FF00'}
                            }
                        ]}
                        config={{
                            scrollZoom: true,
                            responsive: true,
                            displayModeBar: false
                        }}
                        layout={{width: 600, height: 600, title:'Trayectoria en coordenadas cartesianas', dragmode: "pan"}}
                    />
                    : null}
        </div>
    )
}
