import TrajectoryPlot from "../../../plots/TrajectoryPlot";
import TrajectorySidePanel from "./TrajectorySidePanel";
import {useGetTrajectory} from "../../../../api/hooks";
import {useSessionDataContext} from "../../../../context/SessionDataContext";
import {useDriverContext} from "../../../../context/DriverContext";
import {useLapContext} from "../../../../context/LapContext";
import {useState} from "react";

export default function TrajectoryInfo({className=""}) {
    const sessionData = useSessionDataContext();
    const {currentDriver} = useDriverContext();
    const {currentLap} = useLapContext();

    const year = sessionData.year;
    const round = sessionData.round;
    const session = sessionData.session;
    const [trajectoryData,] = useGetTrajectory(year, round, session, currentDriver?.driverNumber, currentLap);

    const [hoveredPoint, setHoveredPoint] = useState(null);
    

    return (
        <div className={"flex flex-col items-center sm:flex-row overflow-clip " + className}>
            <TrajectoryPlot className="h-full w-6/12 lg:w-7/12 2xl:w-8/12" trajectoryData={trajectoryData} hoveredPoint={hoveredPoint} setHoveredPoint={setHoveredPoint}/>
            <div className="h-4/5 lg:h-5/6 2xl:h-4/6 w-6/12 lg:w-5/12 2xl:w-4/12 flex items-center">
                <TrajectorySidePanel className="h-full w-4/5 mx-auto" trajectoryData={trajectoryData} hoveredPoint={hoveredPoint}/>
            </div>
        </div>
    )
}