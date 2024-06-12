import React, { useState } from 'react';
import CartesianPositionPlot from "./CartesianPositionPlot";
import PolarPositionPlot from "./PolarPositionPlot";
import IntrinsicPositionPlot from "./IntrinsicPositionPlot";
import {useSessionDataContext} from "../../context/SessionDataContext";
import {useDriverContext} from "../../context/DriverContext";
import {useLapContext} from "../../context/LapContext";
import {useGetTrajectory} from "../../api/hooks";
import {OrbitProgress} from "react-loading-indicators";
import { CoordinateSystemSelector } from '../inputs/CoordinateSystemSelector';

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

    const orderedSystems = ["cartesian", "polar", "intrinsic"];

    let plots;
    switch (coordinateSystem) {
        case "cartesian":
            plots =  (<CartesianPositionPlot className="w-7/12 h-full ml-4" timeUnit={timeUnit} trajectoryData={trajectoryData} />);
            break;
        case "intrinsic":
            plots =  <IntrinsicPositionPlot className="w-7/12 h-full ml-4" timeUnit={timeUnit}  trajectoryData={trajectoryData}/>;
            break;
        case "polar":
            plots =  <PolarPositionPlot className="w-7/12 h-full ml-4" timeUnit={timeUnit}  trajectoryData={trajectoryData}/>;
            break;
        default:
            plots =  null;
            break;
    }


    return (
        <div className={className + " items-center flex justify-center w-full h-full overflow-clip"}>
            {trajectoryData !== null ?
                <>
                    <CoordinateSystemSelector currentSystem={coordinateSystem} onCoordinateSystemChange={handleCoordinateSystemChange} orderedSystems={orderedSystems} />
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
