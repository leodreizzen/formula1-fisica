import {useGetAcceleration} from "../api/hooks";
import DriverSelector from "./DriverSelector";
import AccelerationPlot from "../plots/AccelerationPlot";
import {useContext} from "react";
import {SessionDataContext} from "../context/SessionDataContext";
import LapSelector from "./LapSelector";

export default function AccelerationsPanel({className, drivers, selectedDriver, lapData, currentLap, onLapChange, onSelectedDriverChange}){

    const lapCount = lapData ? lapData.lapCount : null;
    const {year, round, session} = useContext(SessionDataContext);

    const [accelerationData, accelerationDataLoading] = useGetAcceleration(year, round, session, selectedDriver, currentLap);

    return (<div className={className + " flex flex-col items-center overflow-clip h-full"}>
        <DriverSelector drivers={drivers} selectedDriver={selectedDriver} onDriverChange={onSelectedDriverChange}/>
        {accelerationData ? <AccelerationPlot className="grow pt-2" isDataLoading={accelerationDataLoading} accelerationData={accelerationData} timeUnit={"s"}/>: null}
        <LapSelector lapCount={lapCount} currentLap={currentLap} changeCurrentLap={onLapChange}/>
    </div>);
}