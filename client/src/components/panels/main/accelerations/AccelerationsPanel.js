import MainDriverSelector from "../../../inputs/MainDriverSelector";
import AccelerationPlots from "../../../plots/AccelerationPlots";
import MainLapSelector from "../../../inputs/MainLapSelector";
import {CoordinateSystemSelector} from "../../../inputs/CoordinateSystemSelector";
import {useKinematicVectorsContext} from "../../../../context/KinematicVectorsContext";
import PolarAccelerationPlot from "../../../plots/PolarAccelerationPlot";
import {useState} from "react";
import CartesianAccelerationPlot from "../../../plots/CartesianAccelerationPlot";
import {OrbitProgress} from "react-loading-indicators";

export default function AccelerationsPanel({className}) {
    const [coordinateSystem, setCoordinateSystem] = useState("cartesian");

    const {vectors} = useKinematicVectorsContext();

    const handleCoordinateSystemChange = (event) => {
        setCoordinateSystem(event.target.value);
    };

    let plots;
    if (vectors) {
        switch (coordinateSystem) {
            case "cartesian":
                plots = <CartesianAccelerationPlot className="grow pt-2 h-2/3" timeUnit={"s"} vectors={vectors}/>;
                break;
            case "polar":
                plots = <PolarAccelerationPlot className="grow pt-2 h-2/3" timeUnit={"s"} vectors={vectors}/>;
                break;
            case "intrinsic":
                plots = <AccelerationPlots className="grow pt-2 h-2/3" timeUnit={"s"}/>;
                break;
            default:
                plots = null;
                break;
        }
    } else plots = <div className="grow pt-2 h-2/3 inline-block"><OrbitProgress size='large'
                                                                                color="#EFE2E2"
                                                                                variant='dotted'/></div>

    return (
        <div className={className + " flex flex-col items-center overflow-clip h-full"}>
            <MainDriverSelector className=""/>
            {plots}
            <CoordinateSystemSelector className={"flex"} currentSystem={coordinateSystem}
                                      onCoordinateSystemChange={handleCoordinateSystemChange}/>
            <MainLapSelector className="mb-3 p-1 pl-6 pr-6"/>
        </div>);
}