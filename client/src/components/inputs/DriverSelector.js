import React from "react";
import { useDriverContext } from "../../context/DriverContext";
import DriverSelect from "./DriverSelect";

export default function DriverSelector({ className, currentDriver, onDriverChange, label="Conductor" }) {
    const { drivers } = useDriverContext();

    function onDriverSelectionChange(val) {
        const selected = drivers.find((driver) => driver.driverNumber === val);
        onDriverChange(selected);
    }

    return (
        <div className={"text-white flex xl:flex-col items-center justify-center gap-x-2 " + className}>
            <label className="block pb-1">{label}</label>
            <DriverSelect
                className={"block bg-[#010409] w-max min-w-64 border border-gray-400 rounded-md"}
                drivers={drivers ?? []}
                value={currentDriver ? currentDriver.driverNumber : ""}
                disabled={drivers !== null ? null : true}
                onChange={onDriverSelectionChange}
            />
        </div>
    );
}
