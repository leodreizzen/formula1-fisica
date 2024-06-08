
import TrajectoryMaxSpeedPlot from "../../../plots/TrayectoryMaxSpeedPlot";
import {useGetDynamics, useGetTrajectory} from "../../../../api/hooks";
import {useSessionDataContext} from "../../../../context/SessionDataContext";
import {useDriverContext} from "../../../../context/DriverContext";
import {useLapContext} from "../../../../context/LapContext";
import {useState} from "react";
import TrajectorySidePanelMaxSpeed from "./TrajectorySidePanelMaxSpeed";
import {useKinematicVectorsContext} from "../../../../context/KinematicVectorsContext";

export default function TrajectoryInfoMaxSpeed({className=""}) {
    const sessionData = useSessionDataContext();
    const {currentDriver} = useDriverContext();
    const {currentLap} = useLapContext();

    const year = sessionData.year;
    const round = sessionData.round;
    const session = sessionData.session;
    const [trajectoryData,] = useGetTrajectory(year, round, session, currentDriver?.driverNumber, currentLap);
    const [frictionData,] = useGetDynamics(year, round, session, currentDriver?.driverNumber, currentLap)
    const [hoveredPoint, setHoveredPoint] = useState(null);

    const {getKinematicVectorsFromTime} = useKinematicVectorsContext();
    const time = hoveredPoint !== null && trajectoryData !== null ? trajectoryData[hoveredPoint].time : null;
    const vectorsInTime = getKinematicVectorsFromTime(time);
    const hoveredPointDynamics = hoveredPoint !== null ? frictionData.forces.find(it => it.time === time): null
    const frictionInTime = hoveredPointDynamics?.friction

    return (
        <div className={"flex flex-col items-center sm:flex-row overflow-clip " + className}>
            <TrajectoryMaxSpeedPlot className="h-full w-6/12 lg:w-7/12 2xl:w-8/12" trajectoryData={trajectoryData} frictionData={frictionData} hoveredPoint={hoveredPoint} setHoveredPoint={setHoveredPoint} frictionInTime={frictionInTime} vectorsInTime={vectorsInTime}/>
            <div className="h-4/5 lg:h-5/6 2xl:h-4/6 w-6/12 lg:w-5/12 2xl:w-4/12 flex items-center">
                <TrajectorySidePanelMaxSpeed className="h-full w-4/5 mx-auto" trajectoryData={trajectoryData} hoveredPoint={hoveredPoint} frictionInTime={frictionInTime} vectorsInTime={vectorsInTime}/>
            </div>
        </div>
    )
}