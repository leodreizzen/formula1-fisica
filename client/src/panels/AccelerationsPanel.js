import {useGetAcceleration} from "../api/hooks";
import DriverSelector from "./DriverSelector";
import AccelerationPlot from "../plots/AccelerationPlot";
import {useContext} from "react";
import {SessionDataContext} from "../context/SessionDataContext";

export default function AccelerationsPanel({className, drivers, selectedDriver, lapData, currentLap, onSelectedDriverChange}){

    const {year, round, session} = useContext(SessionDataContext);

    const [accelerationData, accelerationDataLoading] = useGetAcceleration(year, round, session, selectedDriver, currentLap);

    return (<div className={className + " flex flex-col"}>
        <DriverSelector drivers={drivers} selectedDriver={selectedDriver} onDriverChange={onSelectedDriverChange}/>
        {accelerationData ? <AccelerationPlot className="grow pt-2" isDataLoading={accelerationDataLoading} accelerationData={accelerationData} timeUnit={"s"}/>: null}
    </div>);
}