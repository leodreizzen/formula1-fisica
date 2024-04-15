import {MiniPlot} from "./MiniPlot";

export default function
    TrajectorySidePanel({className, trajectoryData, hoveredPoint}) {
    return <div className={className + " bg-[hsl(218,80,10)] rounded-[2.5rem] flex"}>
        <div className="m-auto">
            {hoveredPoint !== null ? (
                <>
                    <p>Tiempo: {trajectoryData[hoveredPoint].time}</p>
                    <p>x: {trajectoryData[hoveredPoint].x/10}m</p>
                    <p>y: {trajectoryData[hoveredPoint].y/10}m</p>
                    <p>z: {trajectoryData[hoveredPoint].z/10}m</p>
                    <MiniPlot trajectoryData={trajectoryData} hoveredPoint={hoveredPoint}/>
                </>
            ) : null}
        < /div>
    </div>
}