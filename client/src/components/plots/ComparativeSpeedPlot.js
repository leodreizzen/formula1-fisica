import React, { useState, useEffect } from "react";
import { useVectorsContext } from "../../context/VectorsContext";


export default function ComparativeSpeedPlot({ className, timeUnit, trajectoryData, trajectorySecondaryData, currentDriver, currentSecondaryDriver, currentLap }) {
    const { vectors } = useVectorsContext(); 
    const [secondaryDriverName, setSecondaryDriverName] = useState(null);

    useEffect(() => {
        if (currentSecondaryDriver != null && currentDriver != null && currentSecondaryDriver.fullName && currentDriver.fullName) {
            setSecondaryDriverName(`${currentDriver.fullName} vs. ${currentSecondaryDriver.fullName} en la vuelta: ${currentLap}`);
        } else {
            setSecondaryDriverName("Ningún conductor secundario seleccionado");
        }
    }, [currentSecondaryDriver, currentDriver, currentLap]);

    return (
        <div className={className}>
            <p>{secondaryDriverName}</p>
        </div>
    );
}
