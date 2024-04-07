import {useEffect, useState} from "react";
import axios from "axios";

export default function DriverSelector({className, sessionData, onDriverChange}){
    const [drivers, setDrivers] = useState([]);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const driversLoaded = drivers.length > 0;
    useEffect(() => {
        if (sessionData){
            axios.get("http://localhost:3002/drivers", {
                params: {
                    year: sessionData.year,
                    roundNumber: sessionData.round,
                    sessionNumber: sessionData.session
                }
            })
            .then(response => {
                setDrivers(response.data)
                setSelectedDriver(0)
            }
            )
        }
    }, [sessionData]);

    function onDriverSelectionChange(event){
        setSelectedDriver(Number(event.target.value));
        onDriverChange(drivers[Number(event.target.value)].driverNumber);
    }

    return (<div className={className}>
        <label className="block">Conductor</label>
        <select value={selectedDriver ? selectedDriver : ""} className={"block w-full border"} id="conductor"
                disabled={driversLoaded ? null : true} onChange={onDriverSelectionChange}>
            {drivers.map((driver, i) => <option key={driver.driverNumber}
                                              value={i}>{driver.driverNumber + " - " + driver.fullName + (driver.countryCode ? (" (" + (driver.countryCode) + ")") :"")  + " - " + driver.teamName}</option>)}
                /* TODO: ver como agregar el teamColor para la font de teamName en cada elemento de la lista */
        </select>
    </div>);
}