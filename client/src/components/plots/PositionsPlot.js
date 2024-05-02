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
        <div className={className + " items-center flex justify-center w-full overflow-clip" + determineComponent()}>
            <div className=' items-start mx-4 align-baseline flex flex-col mt-4 mb-4'>
                <div className="mt-2">
                    <input type="radio" id="cartesian" name="coordinateSystem" value="cartesian"
                           checked={coordinateSystem === "cartesian"} onChange={handleCoordinateSystemChange}/>
                    <label htmlFor="cartesian"> Cartesianas</label>
                </div>
                <div className="mt-2">
                    <input type="radio" id="polar" name="coordinateSystem" value="polar"
                           checked={coordinateSystem === "polar"} onChange={handleCoordinateSystemChange}/>
                    <label htmlFor="polar"> Polares</label>
                </div>
                <div className="mt-2">
                    <input type="radio" id="intrinsic" name="coordinateSystem" value="intrinsic"
                           checked={coordinateSystem === "intrinsic"} onChange={handleCoordinateSystemChange}/>
                    <label htmlFor="intrinsic"> Intrínsecas</label>
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
