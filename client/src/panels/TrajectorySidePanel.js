import {MiniPlot} from "./MiniPlot";

export default function
    TrajectorySidePanel({className, trajectoryData, hoveredPoint}) {

    return <div className={className + " bg-[hsl(218,80,10)] rounded-[2rem] p-4 flex"}>
        <div className="m-auto w-full h-full flex flex-col">
            {hoveredPoint !== null ? (
                <>
                    <p>Tiempo: {trajectoryData[hoveredPoint].time.match(/(\d{2}):(\d{2})\.(\d{2})/)[0]}</p>
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
                            {/*TODO VELOCIDAD*/}
                            <td>{(trajectoryData[hoveredPoint].x / 10).toFixed(2)}m</td>
                            {/*TODO  cambiar*/}
                            <td>{(trajectoryData[hoveredPoint].y / 10).toFixed(2)}m</td>
                            {/*TODO  cambiar*/}
                        </tr>
                        <tr>
                            <th>a</th>
                            {/*TODO ACELERACION}*/}
                            <td>{(trajectoryData[hoveredPoint].x / 10).toFixed(2)}m</td>
                            {/*TODO cambiar */}
                            <td>{(trajectoryData[hoveredPoint].y / 10).toFixed(2)}m</td>
                            {/*TODO cambiar */}
                            <td>{(trajectoryData[hoveredPoint].z / 10).toFixed(2)}m</td>
                            {/*TODO cambiar */}
                        </tr>
                        </tbody>
                    </table>
                    <div className="flex mt-2 items-center justify-end">
                        <div className="w-1/2 flex flex-col text-left">
                            <div className="grid grid-cols-2 ">
                                <span>a tangencial:</span> <span>10</span>
                                <span>a normal:</span> <span>10</span>
                                <span>módulo a:</span> <span>10</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2">
                            <span>módulo v </span> <span>10</span>
                            <span>velocímetro: </span> <span>10</span>
                        </div>
                    </div>
                    <MiniPlot className="w-full grow mt-4" trajectoryData={trajectoryData} hoveredPoint={hoveredPoint}/>
                </>
            ) : null}
        < /div>
    </div>
}