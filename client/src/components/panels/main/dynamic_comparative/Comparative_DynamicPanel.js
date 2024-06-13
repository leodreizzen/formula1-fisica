import React, {useEffect, useState} from "react";
import MainDriverSelector from "../../../inputs/MainDriverSelector";
import DriverSelector from "../../../inputs/DriverSelector";
import {useSessionDataContext} from "../../../../context/SessionDataContext";
import {useDriverContext} from "../../../../context/DriverContext";
import {useLapContext} from "../../../../context/LapContext";
import {useGetLaps, useGetDynamics} from "../../../../api/hooks";
import {OrbitProgress} from "react-loading-indicators";
import LapSelector from "../../../inputs/LapSelector";
import Comparative_DynamicPlot from "../../../plots/Comparative_DynamicPlot";
import AccelerationTypeSelector from "../../../inputs/AccelerationTypeSelector";

export default function Comparative_DynamicPanel({className}) {
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

    const [dynamicData,]  = useGetDynamics(year, round, session, currentDriver?.driverNumber, currentLap) || [];
    const [dynamicSecondaryData,] = useGetDynamics(year, round, session, currentSecondaryDriver?.driverNumber, currentLap) || [];

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
                (dynamicData !== null && dynamicSecondaryData !== null && currentLap !== null) ? (
                    <>
                        <Comparative_DynamicPlot className="flex grow pt-2" dynamicData={dynamicData}
                                                 dynamicSecondaryData={dynamicSecondaryData} currentDriver={currentDriver}
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
