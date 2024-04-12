import Plot from 'react-plotly.js';
import {useGetTrajectory} from "../api/hooks";
import {OrbitProgress} from "react-loading-indicators";
import {useContext, useMemo} from "react";
import {SessionDataContext} from "../context/SessionDataContext";

export default function TrajectoryPlot({className, currentDriver: selectedDriver, currentLap}) {
    const sessionData = useContext(SessionDataContext);
    const {year, round, session} = sessionData;
    const [trajectoryData, trajectoryDataLoading] = useGetTrajectory(year, round, session, selectedDriver, currentLap);

    const minX = useMemo(() => trajectoryData ? Math.min(...(trajectoryData.map(it => it.x))) : null, [trajectoryData]);
    const minY = useMemo(() => trajectoryData ? Math.min(...(trajectoryData.map(it => it.y))) : null, [trajectoryData]);
    const maxX = useMemo(() => trajectoryData ? Math.max(...(trajectoryData.map(it => it.x))) : null, [trajectoryData]);
    const maxY = useMemo(() => trajectoryData ? Math.max(...(trajectoryData.map(it => it.y))) : null, [trajectoryData]);

    return (
        <div className={className} style={{ width: '600px', height: '600px', display: 'flex', justifyContent: 'center', alignItems: 'center'  }}>
            {trajectoryDataLoading ? <OrbitProgress size='large' color="#EFE2E2" variant='dotted'/> :
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
