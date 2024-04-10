import {useEffect, useState} from "react";
import {useGetDrivers} from "../api/hooks.js";

export default function DriverSelector({className, sessionData, onDriverChange}) {
    const year = sessionData !== null ? sessionData.year : null;
    const round = sessionData !== null ? sessionData.round : null;
    const session = sessionData !== null ? sessionData.session : null;

    const [drivers, driversLoading] = useGetDrivers(year, round, session);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const driversLoaded = drivers !== null;

    useEffect(() => {
        if (drivers !== null && drivers.length > 0)
            setSelectedDriver(0)
    }, [drivers]);

    useEffect(() => {
        if (selectedDriver !== null && drivers !== null && drivers.length > 0)
            onDriverChange(drivers[selectedDriver].driverNumber)
    }, [selectedDriver]);

    function onDriverSelectionChange(event) {
        setSelectedDriver(Number(event.target.value));
    }

    return (<div className={className}>
        <label className="block">Conductor</label>
        <select value={selectedDriver ? selectedDriver : ""} className={"block w-full border"} id="conductor"
                disabled={driversLoaded ? null : true} onChange={onDriverSelectionChange}>
            {(driversLoaded && drivers.length > 0) ? (drivers.map((driver, i) => <option key={driver.driverNumber}
                                                                 value={i}>{driver.driverNumber + " - " + driver.fullName + (driver.countryCode ? (" (" + (driver.countryCode) + ")") : "") + " - " + driver.teamName}</option>))
                : null}
            )
            /* TODO: ver como agregar el teamColor para la font de teamName en cada elemento de la lista */
        </select>
    </div>);
}