import {useEffect, useState} from "react";
import {useGetDrivers} from "../api/hooks.js";

export default function DriverSelector({className, drivers, selectedDriver, onDriverChange}) {
    function onDriverSelectionChange(event) {
        onDriverChange(Number(event.target.value));
    }

    return (<div className={className}>
        <label className="block">Conductor</label>
        <select value={selectedDriver ? selectedDriver : ""} className={"block w-full border"} id="conductor"
                disabled={drivers !== null ? null : true} onChange={onDriverSelectionChange}>
            {(drivers !== null && drivers.length > 0) ? (drivers.map((driver, i) => <option key={driver.driverNumber}
                                                                                         value={driver.driverNumber} style={{color: "#${driver.teamColor}"}}>{driver.driverNumber + " - " + driver.fullName + (driver.countryCode ? (" (" + (driver.countryCode) + ")") : "") + " - " + driver.teamName}
                                                                                 </option>))
                : null}
            )
            /* TODO: agregar el teamColor para la font de teamName */
        </select>
    </div>);
}