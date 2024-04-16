import {MiniPlot} from "./MiniPlot";
import {useVectorsContext} from "../context/VectorsContext";

export default function
    TrajectorySidePanel({className, trajectoryData, hoveredPoint}) {
    const {vectors, getVectorsFromTime, vectorsLoading} = useVectorsContext();
    const time = hoveredPoint !== null && trajectoryData !== null ? trajectoryData[hoveredPoint].time : null;
    const vectorsInTime = getVectorsFromTime(time);

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
                        <tr>
                            <th>r</th>
                            <td>{(trajectoryData[hoveredPoint].x / 10).toFixed(2)}m</td>
                            <td>{(trajectoryData[hoveredPoint].y / 10).toFixed(2)}m</td>
                            <td>{(trajectoryData[hoveredPoint].z / 10).toFixed(2)}m</td>
                        </tr>
                        <tr>
                            <th>v</th>
                            <td>{vectorsInTime === undefined ? "-": (vectorsInTime.speed.vX / 10).toFixed(2) + "m/s"}</td>
                            <td>{vectorsInTime === undefined ? "-": (vectorsInTime.speed.vY / 10).toFixed(2) + "m/s"}</td>
                            <td>{vectorsInTime === undefined ? "-": (vectorsInTime.speed.vZ / 10).toFixed(2) + "m/s"}</td>
                        </tr>
                        <tr>
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
                                <span>a tangencial:</span> <span>{vectorsInTime === undefined ? "-": (vectorsInTime.acceleration.aTangential / 10).toFixed(2) + "m/s²"}</span>
                                <span>a normal:</span> <span>{vectorsInTime === undefined ? "-": (vectorsInTime.acceleration.aNormal / 10).toFixed(2) + "m/s²"}</span>
                                <span>módulo a:</span> <span>{vectorsInTime === undefined ? "-": (vectorsInTime.acceleration.module / 10).toFixed(2) + "m/s²"}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2">
                            <span>módulo v </span> <span>{vectorsInTime === undefined ? "-": (vectorsInTime.speed.module / 10).toFixed(2) + "m/s"}</span>
                            <span>velocímetro: </span> <span>{vectorsInTime === undefined ? "-": (vectorsInTime.speed.speedometer / 10).toFixed(2) + "m/s"}</span>
                        </div>
                    </div>
                    <MiniPlot className="w-full grow mt-4" trajectoryData={trajectoryData} hoveredPoint={hoveredPoint}/>
                </>
            ) : null}
        < /div>
    </div>
}