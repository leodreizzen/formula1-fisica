import Plot from 'react-plotly.js';
import {useGetTrajectory} from "../api/hooks";
import {OrbitProgress} from "react-loading-indicators";
import {useMemo} from "react";

export default function TrajectoryPlot({className, sessionData, currentDriver: selectedDriver, currentLap}) {
    const year = sessionData === null ? null : sessionData.year;
    const roundNumber = sessionData === null ? null : sessionData.round;
    const sessionNumber = sessionData === null ? null : sessionData.session;

    const [trajectoryData, trajectoryDataLoading] = useGetTrajectory(year, roundNumber, sessionNumber, selectedDriver, currentLap);

    const minX = useMemo(() => trajectoryData ? Math.min(...(trajectoryData.map(it => it.x))) : null, [trajectoryData]);
    const minY = useMemo(() => trajectoryData ? Math.min(...(trajectoryData.map(it => it.y))) : null, [trajectoryData]);
    const maxX = useMemo(() => trajectoryData ? Math.max(...(trajectoryData.map(it => it.x))) : null, [trajectoryData]);
    const maxY = useMemo(() => trajectoryData ? Math.max(...(trajectoryData.map(it => it.y))) : null, [trajectoryData]);

    return (
        <div style={{ width: '600px', height: '600px' }}>
            {trajectoryDataLoading ? <OrbitProgress  color="#1A212E" /> :
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
                        layout={{width: 600,
                            xaxis: {
                                title: 'X (m)',
                            },
                            yaxis: {
                                title: 'Y (m)',
                            },
                            height: 600,
                            title:'Trayectoria en coordenadas cartesianas',
                            dragmode: "pan"}}
                    />
                    : null}
        </div>
    )
}
