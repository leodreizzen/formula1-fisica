import {frictionColor, normalFrictionColor, trajectoryColor, speedColor, tangentialFrictionColor, maxSpeedColor, speedometerColor} from "../../../../styles";

export default function HoveredPointDataMaxSpeed({trajectoryData, frictionData, hoveredPoint, frictionInTime, vectorsInTime}){

    return(
        <div className="flex flex-col text-xs/4 lg:text-xs/5 xl:text-base 2xl:text-xl no-select">
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
                <tr style={{color: trajectoryColor}}>
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
                <tr style={{color: frictionColor}}>
                    <th>rozamiento</th>
                    <td>{frictionInTime === undefined ? "-" : (frictionData.forces.x / 10).toFixed(2) + "N"}</td>
                    <td>{frictionInTime === undefined ? "-" : (frictionData.forces.y / 10).toFixed(2) + "N"}</td>
                    <td>{frictionInTime === undefined ? "-" : "- N"}</td>
                </tr>
                </tbody>
            </table>
            <div className="flex flex-col lg:flex-row mt-2 items-center lg:justify-center ">
                <div className="flex flex-col text-left lg:mr-4">
                    <div className="grid grid-cols-2">
                        <span style={{color: tangentialFrictionColor}} className="mr-4 lg:mr-2">rozamiento tang.:</span> <span
                        style={{color: tangentialFrictionColor}}>{frictionInTime === undefined ? "-" : (frictionInTime.tangential / 10).toFixed(2) + "N"}</span>
                        <span style={{color: normalFrictionColor}} className="mr-4 lg:mr-2">rozamiento normal:</span> <span
                        style={{color: normalFrictionColor}} >{frictionInTime === undefined ? "-" : (frictionInTime.normal / 10).toFixed(2) + "N"}</span>
                        <span style={{color: frictionColor}} className="mr-4 lg:mr-2">módulo rozamiento:</span> <span
                        style={{color: frictionColor}}>{frictionInTime === undefined ? "-" : (frictionInTime.module / 10).toFixed(2) + "N"}</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 text-left">
                    <span style={{color: speedColor}} className="mr-4 lg:mr-2">módulo v </span> <span
                    style={{color: speedColor}}>{vectorsInTime === undefined ? "-" : (vectorsInTime.velocity.module / 10).toFixed(2) + "m/s"}</span>
                    <span style={{color: speedometerColor}} className="mr-4 lg:mr-2">velocímetro: </span> <span
                    style={{color: speedometerColor}}>{vectorsInTime === undefined ? "-" : (vectorsInTime.velocity.speedometer / 10).toFixed(2) + "m/s"}</span>
                    <span style={{color: maxSpeedColor}} className="mr-4 lg:mr-2">vel. máx: </span> <span
                    style={{color: maxSpeedColor}}>{frictionInTime === undefined || !frictionInTime.hasMaxSpeed ? "-" : (frictionInTime.maxSpeed / 10).toFixed(2) + "m/s"}</span>
                </div>
            </div>
        </div>
    )
}