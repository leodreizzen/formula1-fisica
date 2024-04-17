import {useDriverContext} from "../../context/DriverContext";
import DriverSelect from "./DriverSelect";

export default function DriverSelector({className}) {
    const {drivers, currentDriver, setCurrentDriver} = useDriverContext();
    function onDriverSelectionChange(val) {
        const selected = drivers.find(driver => driver.driverNumber === val);
        setCurrentDriver(selected);
    }

    return (<div className={"text-white " + className}>
        <label className="block pb-1">Conductor</label>
        <DriverSelect className={"block bg-[#010409] mx-auto w-max min-w-64 mb-5 border border-gray-400 rounded-md"} drivers={drivers ? drivers : []} value={currentDriver ? currentDriver.driverNumber : ""} disabled={drivers !== null ? null : true} onChange={onDriverSelectionChange}/>
    </div>);
}