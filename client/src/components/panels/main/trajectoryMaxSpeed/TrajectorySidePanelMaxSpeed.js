import {MiniPlotFriction} from "../../../plots/MiniPlotFriction";
import HoveredPointDataMaxSpeed from "./HoveredPointDataMaxSpeed";

export default function TrajectorySidePanelMaxSpeed({className, trajectoryData, frictionInTime, vectorsInTime, hoveredPoint}) {

    return <div className={className + " bg-[hsl(218,80,10)] rounded-[2rem] p-4 flex"}>
        <div className="m-auto w-full h-full flex flex-col">
            {hoveredPoint !== null ? (
                <>
                    <HoveredPointDataMaxSpeed className=" w-full" trajectoryData={trajectoryData} hoveredPoint={hoveredPoint} frictionInTime={frictionInTime} vectorsInTime={vectorsInTime}/>
                    <MiniPlotFriction className=" w-full grow mt-4" trajectoryData={trajectoryData} frictionInTime={frictionInTime} vectorsInTime={vectorsInTime} hoveredPoint={hoveredPoint}/>
                </>
            ) : null}
        </div>
    </div>
}