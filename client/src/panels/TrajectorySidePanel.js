import {MiniPlot} from "./MiniPlot";

export default function
    TrajectorySidePanel({className, trajectoryData, hoveredPoint}) {

    return <div className={className + " bg-[hsl(218,80,10)] rounded-[2rem] p-4 flex"}>
        <div className="m-auto w-full h-full flex flex-col">
            {hoveredPoint !== null ? (
                <>
                    <p>Tiempo: {trajectoryData[hoveredPoint].time.match(/(\d{2}):(\d{2})\.(\d{2})/)[0]}</p>
                    <p>x: {(trajectoryData[hoveredPoint].x / 10).toFixed(2)}m</p>
                    <p>y: {(trajectoryData[hoveredPoint].y / 10).toFixed(2)}m</p>
                    <p>z: {(trajectoryData[hoveredPoint].z / 10).toFixed(2)}m</p>
                    <MiniPlot className="w-full grow mt-4" trajectoryData={trajectoryData} hoveredPoint={hoveredPoint}/>
                </>
            ) : null}
        < /div>
    </div>
}