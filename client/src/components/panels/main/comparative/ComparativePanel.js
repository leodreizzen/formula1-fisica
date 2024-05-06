import React, { useEffect, useState } from "react";
import DriverSelector from "../../../inputs/DriverSelector";
import DriverSelectorNoContext from "../../../inputs/DriverSelectorNoContext";
import LapSelectorComparative from "../../../inputs/LapSelectorComparative";
import ComparativePlot from "../../../plots/ComparativePlots";
import { useSessionDataContext } from "../../../../context/SessionDataContext";
import { useDriverContext } from "../../../../context/DriverContext";
import { useLapContext } from "../../../../context/LapContext";
import { useGetTrajectory, useGetLaps } from "../../../../api/hooks";
import AccelerationTypeSelector from "../../../inputs/AccelerationTypeSelector";
import {OrbitProgress} from "react-loading-indicators";

export default function ComparativePanel({ className }) {
    const [selectedOption, setSelectedOption] = useState("module");

    const [currentSecondaryDriver, setCurrentSecondaryDriver] = useState(null);
    const sessionData = useSessionDataContext();
    const { currentDriver } = useDriverContext();
    const { currentLap } = useLapContext();

    const year = sessionData.year;
    const round = sessionData.round;
    const session = sessionData.session;

    const [secondaryDriverLaps, ] = useGetLaps(year, round, session, currentSecondaryDriver?.driverNumber) || [];

    const [trajectoryData,] = useGetTrajectory(year, round, session, currentDriver?.driverNumber, currentLap) || [];
    
    let correctedLap = null;
    if (secondaryDriverLaps !== null && currentLap <= secondaryDriverLaps.lapCount) {
        correctedLap = currentLap;
    } 

    const [trajectorySecondaryData,] = useGetTrajectory(year, round, session, currentSecondaryDriver?.driverNumber, correctedLap) || [];

    useEffect(() => {
    }, [currentSecondaryDriver, currentDriver, currentLap])

    const handleSecondaryDriverChange = (driver) => {
        setCurrentSecondaryDriver(driver);
    };

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    return (
        <div className={`${className} flex flex-col items-center overflow-clip h-full`}>
            <div className="flex flex-row w-full">
                <DriverSelector className="w-1/2" />
                <DriverSelectorNoContext className="w-1/2" currentSecondaryDriver={currentSecondaryDriver} onDriverChange={handleSecondaryDriverChange} />
            </div>
            {trajectoryData !== null && trajectorySecondaryData !== null && secondaryDriverLaps !== null ? (
                <>
                    <ComparativePlot className="flex grow pt-2" trajectoryData={trajectoryData} trajectorySecondaryData={trajectorySecondaryData} currentDriver={currentDriver} 
                                        currentSecondaryDriver={currentSecondaryDriver} currentLap={currentLap} selectedOption={selectedOption} 
                                        secondaryLapsCount={secondaryDriverLaps.lapCount} />
                    <AccelerationTypeSelector onChange={handleOptionChange} value={selectedOption} />
                    <LapSelectorComparative className="mb-3 p-1 pl-6 pr-6" secondaryLapsCount={secondaryDriverLaps.lapCount}/>
                </>
            ) : <OrbitProgress size='large'
                color="#EFE2E2"
                variant='dotted'/>}
        </div>
    );
}
