import React, { useState } from "react";
import DriverSelector from "../../../inputs/DriverSelector";
import DriverSelectorNoContext from "../../../inputs/DriverSelectorNoContext";
import LapSelector from "../../../inputs/LapSelector";
import ComparativePlot from "../../../plots/ComparativePlots";
import {useSessionDataContext} from "../../../../context/SessionDataContext";
import {useDriverContext} from "../../../../context/DriverContext";
import {useLapContext} from "../../../../context/LapContext";
import {useGetTrajectory} from "../../../../api/hooks";

export default function ComparativePanel({ className }) {
    const [currentSecondaryDriver, setCurrentSecondaryDriver] = useState(null);
    const sessionData = useSessionDataContext();
    const {currentDriver} = useDriverContext();
    const {currentLap} = useLapContext();

    const year = sessionData.year;
    const round = sessionData.round;
    const session = sessionData.session;

    const [trajectoryData,] = useGetTrajectory(year, round, session, currentDriver?.driverNumber, currentLap) || [];
    const [trajectorySecondaryData,] = useGetTrajectory(year, round, session, currentSecondaryDriver?.driverNumber, currentLap) || [];

    const handleSecondaryDriverChange = (driver) => {
        setCurrentSecondaryDriver(driver);
    };

    return (
        <div className={`${className} flex flex-col items-center overflow-hidden h-full`}>
            <div className="flex flex-row w-full">
                <DriverSelector className="w-1/2" />
                <DriverSelectorNoContext className="w-1/2" currentSecondaryDriver={currentSecondaryDriver} onDriverChange={handleSecondaryDriverChange} />
            </div>
            {trajectoryData === null || trajectorySecondaryData === null ? (
                <div className="w-full h-full flex items-center justify-center">Por favor, seleccione un piloto rival.</div>
            ) : (
                <>
                    <ComparativePlot className="grow pt-2" timeUnit={"s"} trajectoryData={trajectoryData} trajectorySecondaryData={trajectorySecondaryData} currentDriver={currentDriver} currentSecondaryDriver={currentSecondaryDriver} currentLap={currentLap} />
                    <LapSelector className="mb-3 p-1 pl-6 pr-6" />
                </>
            )}
        </div>
    );
    
}
