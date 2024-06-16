import NeckForcesPlot from "../../../plots/NeckForcesPlot";
import NeckForcesSidePanel from "./NeckForcesSidePanel";
import { useGetNeckForces, useGetTrajectory } from "../../../../api/hooks";
import { useSessionDataContext } from "../../../../context/SessionDataContext";
import { useDriverContext } from "../../../../context/DriverContext";
import { useLapContext } from "../../../../context/LapContext";
import { useState, useMemo } from "react";

export default function NeckForcesInfo({ className = "" }) {
    const sessionData = useSessionDataContext();
    const { currentDriver } = useDriverContext();
    const { currentLap } = useLapContext();

    const year = sessionData.year;
    const round = sessionData.round;
    const session = sessionData.session;
    const [neckForces] = useGetNeckForces(year, round, session, currentDriver?.driverNumber, currentLap);

    //useMemo para armar mapeo de tiempo a datos de fuerzas del cuello
    const neckForcesData = useMemo(() => {
        if (neckForces === null)
            return null;
        const neckForcesMap = new Map();
        neckForces.forEach(neckForce => {
            const key = neckForce.time;
            neckForcesMap.set(key, neckForce)
        })
        return neckForcesMap;
    }, [neckForces])

    const [trajectoryData,] = useGetTrajectory(year, round, session, currentDriver?.driverNumber, currentLap);

    const [hoveredPoint, setHoveredPoint] = useState(null);

    const hoveredNeckForcesData = useMemo(() => {
        if (hoveredPoint === null)
            return null;
        return neckForcesData.get(trajectoryData[hoveredPoint].time)
    }, [hoveredPoint, neckForcesData, trajectoryData])

    return (
        <div className={"flex flex-col items-center sm:flex-row overflow-clip " + className}>
            <NeckForcesPlot className="h-full w-6/12 lg:w-7/12 2xl:w-8/12" trajectoryData={trajectoryData} hoveredPoint={hoveredPoint} setHoveredPoint={setHoveredPoint} />
            <div className="h-4/5 lg:h-5/6 2xl:h-4/6 w-6/12 lg:w-5/12 2xl:w-4/12 flex items-center">
                <NeckForcesSidePanel className="h-fit w-4/5 mx-auto" hoveredNeckForcesData={hoveredNeckForcesData} />
            </div>
        </div>
    )
}