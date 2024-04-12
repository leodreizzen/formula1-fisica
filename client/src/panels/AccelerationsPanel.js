import {useGetAcceleration} from "../api/hooks";
import DriverSelector from "./DriverSelector";
import AccelerationPlot from "../plots/AccelerationPlot";

export default function AccelerationsPanel({className, sessionData, drivers, selectedDriver, lap, onSelectedDriverChange}){

    const year = sessionData === null ? null : sessionData.year;
    const roundNumber = sessionData === null ? null : sessionData.round;
    const sessionNumber = sessionData === null ? null : sessionData.session;
    const [accelerationData, accelerationDataLoading] = useGetAcceleration(year, roundNumber, sessionNumber, selectedDriver, lap);

    return (<div className={className + " flex flex-col"}>
        <DriverSelector sessionData={sessionData} drivers={drivers} selectedDriver={selectedDriver} onDriverChange={onSelectedDriverChange}/>
        {accelerationData ? <AccelerationPlot className="grow pt-2" isDataLoading={accelerationDataLoading} accelerationData={accelerationData} timeUnit={"s"}/>: null}
    </div>);
}