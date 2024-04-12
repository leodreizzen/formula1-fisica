import {useEffect, useState} from "react";
import {useGetDrivers} from "../api/hooks.js";

export default function DriverSelector({className, drivers, selectedDriver, onDriverChange}) {
    function onDriverSelectionChange(event) {
        onDriverChange(Number(event.target.value));
    }

    return (<div className={"text-white " + className}>
        <label className="block">Conductor</label>
        <select value={selectedDriver ? selectedDriver : ""} className={"block bg-[#010409] mx-auto mb-5 border border-gray-400 rounded-md"} id="conductor"
                disabled={drivers !== null ? null : true} onChange={onDriverSelectionChange}>
            {(drivers !== null && drivers.length > 0) ? (drivers.map((driver, i) => <option key={driver.driverNumber}
                                                                                         value={driver.driverNumber} style={{color: "#${driver.teamColor}"}}>{driver.driverNumber + " - " + driver.fullName + (driver.countryCode ? (" (" + (driver.countryCode) + ")") : "") + " - " + driver.teamName}
                                                                                 </option>))
                : null}
            )
            /* TODO: agregar el teamColor para la font de teamName */
        </select>
    </div>);
                /* TODO: agregar el teamColor para la font de teamName */

}