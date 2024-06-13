import {useKinematicVectorsContext} from "../../context/KinematicVectorsContext";
import {useMemo, useState} from "react";
import {timeDeltaToTimeUnit} from "../../client-util";
import {OrbitProgress} from "react-loading-indicators";
import BasePlot from "./BasePlot";

export default function SpeedsPlot({className, timeUnit})  {
    const {vectors} = useKinematicVectorsContext();
    const [visible, setVisible] = useState([true, true]);

    function handleUpdate(state) {
        if(state.data[0].visible !== visible[0] || state.data[1].visible !== visible[1])
            setVisible([state.data[0].visible, state.data[1].visible])
    }

    const calculatedSpeed = useMemo(() => {
            return {
                x: vectors?.map(it => timeDeltaToTimeUnit(it.time, timeUnit)),
                y: vectors?.map(it => it.velocity.module / 10),
                type: 'scatter',
                mode: 'lines',
                marker: {color: 'red'},
            }
        }, [vectors, timeUnit]);

    const speedometerTrace = useMemo(()=>{
        return {
            x: vectors?.map(it => timeDeltaToTimeUnit(it.time, timeUnit)),
            y: vectors?.map(it => it.velocity.speedometer / 10),
            type: 'scatter',
            mode: 'lines',
            marker: {color: 'orange'},
        }
    }, [vectors, timeUnit]);

    const plotLayout = useMemo(() => {
            const yAxisFont = {
                size:17
            }
            return {
                xaxis: {
                    title: 'Tiempo [' + timeUnit + "]", tolerance: 0.1
                },
                yaxis: {
                    title: 'Velocidad [m/s]', titlefont: yAxisFont, tolerance:0.1
                },
                margin: {t: 20},
            }
        }, [timeUnit]);

    return (
        <div className={className + " flex justify-center w-full overflow-clip"}>
            {vectors !== null ?
                <>
                    <BasePlot
                        className={className + " flex justify-center w-full"}
                        data={[
                            {...calculatedSpeed, xaxis: 'x1', yaxis: 'y1', name: "Velocidad Calculada", visible: visible[0]},
                            {...speedometerTrace, xaxis: 'x1', yaxis: 'y1', name: "Velocímetro", visible: visible[1]},
                        ]}
                        layout={plotLayout}
                        config={{responsive: true, scrollZoom: true, displayModeBar: false}}
                        onUpdate={handleUpdate}
                    />
                </>
                :
                <>
                    <div className="w-full h-full flex items-center justify-center"><OrbitProgress size='large'
                                                                                                  color="#EFE2E2"
                                                                                                  variant='dotted'/>
                    </div>

                </>
            }

        </div>
    )
}