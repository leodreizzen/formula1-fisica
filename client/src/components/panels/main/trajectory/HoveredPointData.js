import {accelerationColor, normalAccelerationColor, trajectoryColor, speedColor, tangentialAccelerationColor} from "../../../../styles";
import {useDriverContext} from "../../../../context/DriverContext";
import {useVectorsContext} from "../../../../context/VectorsContext";

export default function HoveredPointData({trajectoryData, hoveredPoint}){
    const {getVectorsFromTime} = useVectorsContext();
    const time = hoveredPoint !== null && trajectoryData !== null ? trajectoryData[hoveredPoint].time : null;
    const vectorsInTime = getVectorsFromTime(time);
    const {currentDriver} = useDriverContext();

    return(
        <div className="flex flex-col text-xs/4 lg:text-sm no-select">
            <p>Tiempo: {trajectoryData[hoveredPoint].time.match(/(\d{2}):(\d{2})\.(\d{3})/)[0]}</p>
            <table className="table-auto">
                <thead>
                    <tr>
                    <th></th>
                    <th>x</th>
                    <th>y</th>
                    <th>z</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style={{ color: trajectoryColor }}>
                        <th>r</th>
                        <td>{(trajectoryData[hoveredPoint].cartesian.x / 10).toFixed(2)}m</td>
                        <td>{(trajectoryData[hoveredPoint].cartesian.y / 10).toFixed(2)}m</td>
                        <td>{(trajectoryData[hoveredPoint].cartesian.z / 10).toFixed(2)}m</td>
                    </tr>
                    <tr style={{color: speedColor}}>
                        <th>v</th>
                        <td>{vectorsInTime === undefined ? "-" : (vectorsInTime.velocity.vX / 10).toFixed(2) + "m/s"}</td>
                        <td>{vectorsInTime === undefined ? "-" : (vectorsInTime.velocity.vY / 10).toFixed(2) + "m/s"}</td>
                        <td>{vectorsInTime === undefined ? "-" : (vectorsInTime.velocity.vZ / 10).toFixed(2) + "m/s"}</td>
                    </tr>
                    <tr style={{color: accelerationColor}}>
                        <th>a</th>
                        <td>{vectorsInTime === undefined ? "-" : (vectorsInTime.acceleration.aX / 10).toFixed(2) + "m/s²"}</td>
                        <td>{vectorsInTime === undefined ? "-" : (vectorsInTime.acceleration.aY / 10).toFixed(2) + "m/s²"}</td>
                        <td>{vectorsInTime === undefined ? "-" : (vectorsInTime.acceleration.aZ / 10).toFixed(2) + "m/s²"}</td>
                    </tr>
                </tbody>
            </table>
                <div className="flex items-center lg:justify-center mt-2">
                        <div className="grid grid-rows-2 mx-auto">
                            <span style={{color: tangentialAccelerationColor}}>
                                a tang.: {vectorsInTime === undefined ? "-" : (vectorsInTime.acceleration.aTangential / 10).toFixed(2) + "m/s²"}
                            </span>
                            <span style={{color: normalAccelerationColor}} >
                                a normal: {vectorsInTime === undefined ? "-" : (vectorsInTime.acceleration.aNormal / 10).toFixed(2) + "m/s²"}
                            </span>
                            <span style={{color: accelerationColor}}>
                                módulo a: {vectorsInTime === undefined ? "-" : (vectorsInTime.acceleration.module / 10).toFixed(2) + "m/s²"}
                            </span>
                        </div>
                    
                        <div className="grid grid-rows-2 text-left mx-auto">
                            <span style={{color: speedColor,}} className="mx-auto my-0">
                                módulo v: {vectorsInTime === undefined ? "-" : (vectorsInTime.velocity.module / 10).toFixed(2) + "m/s"}
                            </span>
                            <span style={{color: speedColor}} className="mx-auto my-0">
                                velocímetro: {vectorsInTime === undefined ? "-" : (vectorsInTime.velocity.speedometer / 10).toFixed(2) + "m/s"}
                            </span>
                        </div>
                    
                </div>
        </div>
    )
}