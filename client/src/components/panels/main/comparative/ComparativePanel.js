import React, {useEffect, useState} from "react";
import MainDriverSelector from "../../../inputs/MainDriverSelector";
import DriverSelector from "../../../inputs/DriverSelector";
import ComparativePlot from "../../../plots/ComparativePlots";
import {useSessionDataContext} from "../../../../context/SessionDataContext";
import {useDriverContext} from "../../../../context/DriverContext";
import {useLapContext} from "../../../../context/LapContext";
import {useGetLaps, useGetKinematicsComparison} from "../../../../api/hooks";
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

    const [comparisonData] = useGetKinematicsComparison(year, round, session, currentDriver?.driverNumber, currentSecondaryDriver?.driverNumber, currentLap);
    const firstDriverData = comparisonData ? comparisonData[0].data : null;
    const secondDriverData = comparisonData ? comparisonData[1].data : null;
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
            <div className="flex flex-row w-full justify-evenly">
                <MainDriverSelector/>
                <DriverSelector currentSecondaryDriver={currentSecondaryDriver}
                                onDriverChange={handleSecondaryDriverChange} label="Conductor rival"/>
            </div>
            {currentSecondaryDriver !== null ?
                (firstDriverData !== null && secondDriverData !== null && currentLap !== null) ? (
                    <>
                        <ComparativePlot className="flex grow pt-2"
                                         currentDriver={currentDriver}
                                         currentSecondaryDriver={currentSecondaryDriver}
                                         firstDriverData={firstDriverData}
                                         secondDriverData={secondDriverData}
                                         currentLap={currentLap}
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
