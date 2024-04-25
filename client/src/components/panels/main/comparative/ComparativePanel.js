import React, { useState } from "react";
import DriverSelector from "../../../inputs/DriverSelector";
import DriverSelectorNoContext from "../../../inputs/DriverSelectorNoContext";
import LapSelector from "../../../inputs/LapSelector";
import ComparativeSpeedPlot from "../../../plots/ComparativeSpeedPlot";

export default function ComparativePanel({ className }) {
    const [currentSecondaryDriver, setCurrentSecondaryDriver] = useState(null);

    const handleSecondaryDriverChange = (driver) => {
        setCurrentSecondaryDriver(driver);
    };

    return (
        <div className={`${className} flex flex-col items-center overflow-hidden h-full`}>
            <div className="flex flex-row w-full">
                <DriverSelector className="w-1/2" />
                <DriverSelectorNoContext className="w-1/2" currentSecondaryDriver={currentSecondaryDriver} onDriverChange={handleSecondaryDriverChange} />
            </div>
            <ComparativeSpeedPlot className="grow pt-2" timeUnit={"s"} currentSecondaryDriver={currentSecondaryDriver} />
            <LapSelector className="mb-3 p-1 pl-6 pr-6" />
        </div>
    );
}
