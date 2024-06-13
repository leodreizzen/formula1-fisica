import MainDriverSelector from "../../../inputs/MainDriverSelector";
import AccelerationPlots from "../../../plots/AccelerationPlots";
import MainLapSelector from "../../../inputs/MainLapSelector";
import { CoordinateSystemSelector } from "../../../inputs/CoordinateSystemSelector";
import { useKinematicVectorsContext } from "../../../../context/KinematicVectorsContext";
import PolarAccelerationPlot from "../../../plots/PolarAccelerationPlot";
import { useState } from "react";
import CartesianAccelerationPlot from "../../../plots/CartesianAccelerationPlot";

export default function AccelerationsPanel({className}){
    const [coordinateSystem, setCoordinateSystem] = useState("intrinsic");

    const {vectors} = useKinematicVectorsContext();
    const orderedSystems = ["intrinsic", "polar", "cartesian"];

    const handleCoordinateSystemChange = (event) => {
        setCoordinateSystem(event.target.value);
    };

    let plots;
    switch (coordinateSystem) {
        case "intrinsic":
            plots = <AccelerationPlots className="grow pt-2 h-2/3"  timeUnit={"s"}/>;
            break;
        case "polar":
            plots = <PolarAccelerationPlot className="grow pt-2 h-2/3" timeUnit={"s"}  vectors={vectors}/>;
            break;
        case "cartesian":
            plots = <CartesianAccelerationPlot className="grow pt-2 h-2/3" timeUnit={"s"}  vectors={vectors}/>;
            break;
        default:
            plots = null;
            break;
    }

    return (
    <div className={className + " flex flex-col items-center overflow-clip h-full"}>
        <MainDriverSelector/>
        {plots}
        <CoordinateSystemSelector className={"flex"} currentSystem={coordinateSystem} onCoordinateSystemChange={handleCoordinateSystemChange} orderedSystems={orderedSystems}/>
        <MainLapSelector className="mb-3 p-1 pl-6 pr-6"/>
    </div>);
}