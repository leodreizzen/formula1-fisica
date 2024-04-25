import React, { useState, useEffect } from "react";
import { useVectorsContext } from "../../context/VectorsContext";

export default function ComparativeSpeedPlot({ className, timeUnit, currentSecondaryDriver }) {
    const { vectors } = useVectorsContext();
    const [secondaryDriverName, setSecondaryDriverName] = useState(null);

    useEffect(() => {
        if (currentSecondaryDriver != null && currentSecondaryDriver.fullName) {
            setSecondaryDriverName(`Conductor secundario: ${currentSecondaryDriver.fullName}`);
        } else {
            setSecondaryDriverName("Ningún conductor secundario seleccionado");
        }
    }, [currentSecondaryDriver]);

    return (
        <div className={className}>
            <p>{secondaryDriverName}</p>
        </div>
    );
}
