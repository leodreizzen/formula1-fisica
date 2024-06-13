import MainDriverSelector from "../../../inputs/MainDriverSelector";
import SpeedsPlot from "../../../plots/SpeedsPlot";
import PolarSpeedPlot from "../../../plots/PolarSpeedPlot";
import MainLapSelector from "../../../inputs/MainLapSelector";
import { useState } from "react";
import { CoordinateSystemSelector } from "../../../inputs/CoordinateSystemSelector";
import { useKinematicVectorsContext } from "../../../../context/KinematicVectorsContext";
import { OrbitProgress } from "react-loading-indicators";
import CartesianSpeedPlot from "../../../plots/CartesianSpeedPlot";

export default function VelocitiesPanel({ className }) {
    const [coordinateSystem, setCoordinateSystem] = useState("cartesian");
    const {vectors} = useKinematicVectorsContext();

    const handleCoordinateSystemChange = (event) => {
        setCoordinateSystem(event.target.value);
    };

    let plots;
    switch (coordinateSystem) {
        case "cartesian":
            plots = <CartesianSpeedPlot className="w-7/12 h-full ml-4" timeUnit={"s"}  vectors={vectors}/>;
            break;
        case "polar":
            plots = <PolarSpeedPlot className="w-7/12 h-full ml-4" timeUnit={"s"}  vectors={vectors}/>;
            break;
        case "intrinsic":
            plots = <SpeedsPlot className="w-7/12 h-full ml-4" timeUnit={"s"} vectors={vectors} />;
            break;
        default:
            plots = null;
            break;
    }

    return (
        <div className={className + " flex flex-col items-center overflow-clip h-full pt-2"}>
            <MainDriverSelector />
            <div className="items-center flex justify-center w-full h-full overflow-clip">
                {vectors !== null ?
                    <>
                        <CoordinateSystemSelector currentSystem={coordinateSystem} onCoordinateSystemChange={handleCoordinateSystemChange} />
                        {plots}
                    </>
                    :
                    <>
                        <div className="w-1/2 h-full flex items-center justify-center"><OrbitProgress size='large'
                            color="#EFE2E2"
                            variant='dotted' />
                        </div>
                    </>
                }
            </div>
            <MainLapSelector className="mb-3 p-1 pl-6 pr-6" />
        </div>
    );
}