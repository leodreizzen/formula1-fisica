import {useEffect, useState} from "react";
import {useGetDrivers} from "../api/hooks.js";

export default function DriverSelector({className, sessionData, selectedDriver, onDriverChange}) {
    const year = sessionData !== null ? sessionData.year : null;
    const round = sessionData !== null ? sessionData.round : null;
    const session = sessionData !== null ? sessionData.session : null;

    const [drivers, driversLoading] = useGetDrivers(year, round, session);
    const driversLoaded = drivers !== null;

    useEffect(() => {
        if (drivers !== null && drivers.length > 0)
            onDriverChange(drivers[0].driverNumber);
    }, [drivers]);


    function onDriverSelectionChange(event) {
        onDriverChange(Number(event.target.value));
    }

    return (<div className={"text-white " + className}>
        <label className="block">Conductor</label>
        <select value={selectedDriver ? selectedDriver : ""} className={"block bg-[#010409] mx-auto mb-5 border border-gray-400 rounded-md"} id="conductor"
                disabled={driversLoaded ? null : true} onChange={onDriverSelectionChange}>
            {(driversLoaded && drivers.length > 0) ? (drivers.map((driver, i) => <option key={driver.driverNumber}
                                                                                         value={driver.driverNumber} style={{color: "#${driver.teamColor}"}}>{driver.driverNumber + " - " + driver.fullName + (driver.countryCode ? (" (" + (driver.countryCode) + ")") : "") + " - " + driver.teamName}
                                                                                 </option>))
                : null}
            )
        </select>
    </div>);
                /* TODO: agregar el teamColor para la font de teamName */

}