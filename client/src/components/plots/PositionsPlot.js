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

    const determineComponent = () => {
        switch (coordinateSystem) {
            case "cartesian":
                return (<CartesianPositionPlot className="w-1/2 h-full" timeUnit={timeUnit} trajectoryData={trajectoryData} />);
            case "intrinsic":
                return <IntrinsicPositionPlot className="w-1/2 h-full" timeUnit={timeUnit}  trajectoryData={trajectoryData}/>;
            case "polar":
                return <PolarPositionPlot className="w-1/2 h-full" timeUnit={timeUnit}  trajectoryData={trajectoryData}/>;
            default:
                return null;
        }
    };

    return (
        <div className={className + " items-center flex justify-center w-full h-full overflow-clip"}>
            <div className="flex flex-col items-start">
                <div className="mt-6">
                    <input type="radio" id="cartesian" name="coordinateSystem" value="cartesian" className="hidden"
                           checked={coordinateSystem === "cartesian"} onChange={handleCoordinateSystemChange}/>
                    <label htmlFor="cartesian"
                           className="p-2 border border-white rounded-full cursor-pointer bg-white text-black">Cartesianas</label>
                </div>
                <div className="mt-6">
                    <input type="radio" id="polar" name="coordinateSystem" value="polar" className="hidden"
                           checked={coordinateSystem === "polar"} onChange={handleCoordinateSystemChange}/>
                    <label htmlFor="polar"
                           className="p-2 border border-white rounded-full cursor-pointer bg-white text-black">Polares</label>
                </div>
                <div className="mt-6">
                    <input type="radio" id="intrinsic" name="coordinateSystem" value="intrinsic" className="hidden"
                           checked={coordinateSystem === "intrinsic"} onChange={handleCoordinateSystemChange}/>
                    <label htmlFor="intrinsic"
                           className="p-2 border border-white rounded-full cursor-pointer bg-white text-black">Intrínsecas</label>
                </div>
            </div>
            {trajectoryData !== null ?
                <>
                    {determineComponent()}
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
