import React, {useEffect, useState} from "react";
import MainDriverSelector from "../../../inputs/MainDriverSelector";
import DriverSelector from "../../../inputs/DriverSelector";
import ComparativePlot from "../../../plots/ComparativePlots";
import {useSessionDataContext} from "../../../../context/SessionDataContext";
import {useDriverContext} from "../../../../context/DriverContext";
import {useLapContext} from "../../../../context/LapContext";
import {useGetTrajectory, useGetLaps} from "../../../../api/hooks";
import AccelerationTypeSelector from "../../../inputs/AccelerationTypeSelector";
import {OrbitProgress} from "react-loading-indicators";
import LapSelector from "../../../inputs/LapSelector";

export default function ComparativePanel({className}) {
    const [selectedOption, setSelectedOption] = useState("module");

    const [currentSecondaryDriver, setCurrentSecondaryDriver] = useState(null);
    const sessionData = useSessionDataContext();
    const {currentDriver} = useDriverContext();
    const {lapCount: mainLapCount, currentLap: mainCurrentLap, setCurrentLap} = useLapContext()

    const year = sessionData?.year;
    const round = sessionData?.round;
    const session = sessionData?.session;

    const [secondaryLapData,] = useGetLaps(year, round, session, currentSecondaryDriver?.driverNumber) || [];
    const secondaryLapCount = secondaryLapData?.lapCount ?? null;
    const commonLaps = (mainLapCount !== null && secondaryLapCount !== null) ? Math.min(mainLapCount, secondaryLapCount) : null;
    const currentLap = (mainCurrentLap !== null && commonLaps !== null) ? Math.min(mainCurrentLap, commonLaps) : null;

    const [trajectoryData,] = useGetTrajectory(year, round, session, currentDriver?.driverNumber, currentLap) || [];
    const [trajectorySecondaryData,] = useGetTrajectory(year, round, session, currentSecondaryDriver?.driverNumber, currentLap) || [];

    useEffect(() => {
        if (currentLap !== null && currentLap !== mainCurrentLap) {
            setCurrentLap(currentLap);
        }
    }, [currentLap, mainCurrentLap])

    const handleSecondaryDriverChange = (driver) => {
        setCurrentSecondaryDriver(driver);
    };

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    return (
        <div className={`${className} flex flex-col items-center overflow-clip h-full`}>
            <div className="flex flex-row w-full">
                <MainDriverSelector className="w-1/2"/>
                <DriverSelector className="w-1/2" currentSecondaryDriver={currentSecondaryDriver}
                                onDriverChange={handleSecondaryDriverChange}/>
            </div>
            {currentSecondaryDriver !== null ?
                (trajectoryData !== null && trajectorySecondaryData !== null && currentLap !== null) ? (
                    <>
                        <ComparativePlot className="flex grow pt-2" trajectoryData={trajectoryData}
                                         trajectorySecondaryData={trajectorySecondaryData} currentDriver={currentDriver}
                                         currentSecondaryDriver={currentSecondaryDriver} currentLap={currentLap}
                                         selectedOption={selectedOption}/>
                        <AccelerationTypeSelector onChange={handleOptionChange} value={selectedOption}/>
                        <LapSelector className="mb-3 p-1 pl-6 pr-6" lapCount={commonLaps} currentLap={currentLap}
                                     onCurrentLapChange={setCurrentLap}/>
                    </>
                ) : <OrbitProgress size='large'
                                   color="#EFE2E2"
                                   variant='dotted'/>
                : <div>Seleccione un conductor para comparar</div>
            }
        </div>
    );
}
