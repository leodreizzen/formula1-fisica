import {MiniPlot} from "../../../plots/MiniPlot";
import {useVectorsContext} from "../../../../context/VectorsContext";
import {accelerationColor, normalAccelerationColor, speedColor, tangentialAccelerationColor} from "../../../../styles";
import {useDriverContext} from "../../../../context/DriverContext";

export default function
    TrajectorySidePanel({className, trajectoryData, hoveredPoint}) {
    const {getVectorsFromTime} = useVectorsContext();
    const time = hoveredPoint !== null && trajectoryData !== null ? trajectoryData[hoveredPoint].time : null;
    const vectorsInTime = getVectorsFromTime(time);
    const {currentDriver} = useDriverContext();

    return <div className={className + " bg-[hsl(218,80,10)] rounded-[2rem] p-4 flex"}>
        <div className="m-auto w-full h-full flex flex-col">
            {hoveredPoint !== null ? (
                <>
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
                        <tr style={{color: "#" + currentDriver?.teamColor}}>
                            <th>r</th>
                            <td>{(trajectoryData[hoveredPoint].x / 10).toFixed(2)}m</td>
                            <td>{(trajectoryData[hoveredPoint].y / 10).toFixed(2)}m</td>
                            <td>{(trajectoryData[hoveredPoint].z / 10).toFixed(2)}m</td>
                        </tr>
                        <tr style={{color: speedColor}}>
                            <th>v</th>
                            <td>{vectorsInTime === undefined ? "-": (vectorsInTime.speed.vX / 10).toFixed(2) + "m/s"}</td>
                            <td>{vectorsInTime === undefined ? "-": (vectorsInTime.speed.vY / 10).toFixed(2) + "m/s"}</td>
                            <td>{vectorsInTime === undefined ? "-": (vectorsInTime.speed.vZ / 10).toFixed(2) + "m/s"}</td>
                        </tr>
                        <tr style={{color: accelerationColor}}>
                            <th>a</th>
                            <td>{vectorsInTime === undefined ? "-": (vectorsInTime.acceleration.aX / 10).toFixed(2) + "m/s²"}</td>
                            <td>{vectorsInTime === undefined ? "-": (vectorsInTime.acceleration.aY / 10).toFixed(2) + "m/s²"}</td>
                            <td>{vectorsInTime === undefined ? "-": (vectorsInTime.acceleration.aZ / 10).toFixed(2) + "m/s²"}</td>
                        </tr>
                        </tbody>
                    </table>
                    <div className="flex mt-2 items-center justify-end">
                        <div className="w-1/2 flex flex-col text-left">
                            <div className="grid grid-cols-2 ">
                                <span style={{color: tangentialAccelerationColor}}>a tangencial:</span> <span style={{color: tangentialAccelerationColor}}>{vectorsInTime === undefined ? "-": (vectorsInTime.acceleration.aTangential / 10).toFixed(2) + "m/s²"}</span>
                                <span style={{color: normalAccelerationColor}}>a normal:</span> <span style={{color: normalAccelerationColor}}>{vectorsInTime === undefined ? "-": (vectorsInTime.acceleration.aNormal / 10).toFixed(2) + "m/s²"}</span>
                                <span style={{color: accelerationColor}}>módulo a:</span> <span style={{color: accelerationColor}}>{vectorsInTime === undefined ? "-": (vectorsInTime.acceleration.module / 10).toFixed(2) + "m/s²"}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2">
                            <span style={{color: speedColor}}>módulo v </span> <span style={{color: speedColor}}>{vectorsInTime === undefined ? "-": (vectorsInTime.speed.module / 10).toFixed(2) + "m/s"}</span>
                            <span style={{color: speedColor}}>velocímetro: </span> <span style={{color: speedColor}}>{vectorsInTime === undefined ? "-": (vectorsInTime.speed.speedometer / 10).toFixed(2) + "m/s"}</span>
                        </div>
                    </div>
                    <MiniPlot className="w-full grow mt-4" trajectoryData={trajectoryData} hoveredPoint={hoveredPoint}/>
                </>
            ) : null}
        < /div>
    </div>
}