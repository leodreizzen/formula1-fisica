import TrajectoryPlot from "../plots/TrajectoryPlot";
import TrajectorySidePanel from "./TrajectorySidePanel";
import {useGetTrajectory} from "../api/hooks";
import {useSessionDataContext} from "../context/SessionDataContext";
import {useDriverContext} from "../context/DriverContext";
import {useLapContext} from "../context/LapContext";
import {useState} from "react";

export default function TrajectoryInfo({className=""}) {
    const sessionData = useSessionDataContext();
    const {currentDriver} = useDriverContext();
    const {currentLap} = useLapContext();

    const year = sessionData.year;
    const round = sessionData.round;
    const session = sessionData.session;
    const [trajectoryData, trajectoryDataLoading] = useGetTrajectory(year, round, session, currentDriver?.driverNumber, currentLap);

    const [hoveredPoint, setHoveredPoint] = useState(null);

    return (
        <div className={"flex flex-col items-center sm:flex-row overflow-clip " + className}>
            <TrajectoryPlot className="h-full w-2/3" trajectoryData={trajectoryData} trajectoryDataLoading={trajectoryDataLoading} hoveredPoint={hoveredPoint} setHoveredPoint={setHoveredPoint}/>
            <div className="h-2/5 w-1/3 flex items-center">
                <TrajectorySidePanel className="h-full w-4/5 mx-auto" trajectoryData={trajectoryData} hoveredPoint={hoveredPoint}/>
            </div>
        </div>
    )
}