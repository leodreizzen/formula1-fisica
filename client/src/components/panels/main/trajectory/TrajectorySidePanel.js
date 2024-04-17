import {MiniPlot} from "../../../plots/MiniPlot";
import HoveredPointData from "./HoveredPointData";

export default function
    TrajectorySidePanel({className, trajectoryData, hoveredPoint}) {

    return <div className={className + " bg-[hsl(218,80,10)] rounded-[2rem] p-4 flex"}>
        <div className="m-auto w-full h-full flex flex-col">
            {hoveredPoint !== null ? (
                <>
                    <HoveredPointData className="w-full" trajectoryData={trajectoryData} hoveredPoint={hoveredPoint}/>
                    <MiniPlot className="w-full grow mt-4" trajectoryData={trajectoryData} hoveredPoint={hoveredPoint}/>
                </>
            ) : null}
        < /div>
    </div>
}