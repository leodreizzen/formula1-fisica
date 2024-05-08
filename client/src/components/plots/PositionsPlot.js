import React, { useState } from 'react';
import CartesianPositionPlot from "./CartesianPositionPlot";
import PolarPositionPlot from "./PolarPositionPlot";
import IntrinsicPositionPlot from "./IntrinsicPositionPlot";
import {useSessionDataContext} from "../../context/SessionDataContext";
import {useDriverContext} from "../../context/DriverContext";
import {useLapContext} from "../../context/LapContext";
import {useGetTrajectory} from "../../api/hooks";
import {OrbitProgress} from "react-loading-indicators";

export function PositionsPlot({className, timeUnit}) {
    const sessionData = useSessionDataContext();
    const {currentDriver} = useDriverContext();
    const {currentLap} = useLapContext();

    const year = sessionData.year;
    const round = sessionData.round;
    const session = sessionData.session;
    const [trajectoryData,] = useGetTrajectory(year, round, session, currentDriver?.driverNumber, currentLap);

    const [coordinateSystem, setCoordinateSystem] = useState("cartesian");

    const handleCoordinateSystemChange = (event) => {
        setCoordinateSystem(event.target.value);
    };

    let plots;
    switch (coordinateSystem) {
        case "cartesian":
            plots =  (<CartesianPositionPlot className="w-1/2 h-full" timeUnit={timeUnit} trajectoryData={trajectoryData} />);
            break;
        case "intrinsic":
            plots =  <IntrinsicPositionPlot className="w-1/2 h-full" timeUnit={timeUnit}  trajectoryData={trajectoryData}/>;
            break;
        case "polar":
            plots =  <PolarPositionPlot className="w-1/2 h-full" timeUnit={timeUnit}  trajectoryData={trajectoryData}/>;
            break;
        default:
            plots =  null;
            break;
    }


    return (
        <div className={className + " items-center flex justify-center w-full h-full overflow-clip"}>
            {trajectoryData !== null ?
                <>
                    <div className="flex flex-col items-start">
                        <div className="mt-6">
                            <input type="radio" id="cartesian" name="coordinateSystem" value="cartesian"
                                   className="hidden"
                                   checked={coordinateSystem === "cartesian"} onChange={handleCoordinateSystemChange}/>
                            <label htmlFor="cartesian"
                                   className={"no-select p-2 border border-white rounded-full cursor-pointer " + (coordinateSystem === "cartesian" ? "bg-blue-600 text-white " : "bg-white text-black ")}>Cartesianas</label>
                        </div>
                        <div className="mt-6">
                            <input type="radio" id="polar" name="coordinateSystem" value="polar" className="hidden"
                                   checked={coordinateSystem === "polar"} onChange={handleCoordinateSystemChange}/>
                            <label htmlFor="polar"
                                   className={"no-select p-2 border border-white rounded-full cursor-pointer " + (coordinateSystem === "polar" ? "bg-blue-600 text-white " : "bg-white text-black ")}>Polares</label>
                        </div>
                        <div className="mt-6">
                            <input type="radio" id="intrinsic" name="coordinateSystem" value="intrinsic"
                                   className="hidden"
                                   checked={coordinateSystem === "intrinsic"} onChange={handleCoordinateSystemChange}/>
                            <label htmlFor="intrinsic"
                                   className={"no-select p-2 border border-white rounded-full cursor-pointer " + (coordinateSystem === "intrinsic" ? "bg-blue-600 text-white " : "bg-white text-black ")}>Intrínsecas</label>
                        </div>
                    </div>
                    {plots}
                </>
                :
                <>
                    <div className="w-1/2 h-full flex items-center justify-center"><OrbitProgress size='large'
                                                                                                  color="#EFE2E2"
                                                                                                  variant='dotted'/>
                    </div>

                </>
            }
        </div>
    );
}