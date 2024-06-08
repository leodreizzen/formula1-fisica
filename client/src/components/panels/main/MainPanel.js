import TrajectoryPanel from "./trajectory/TrajectoryPanel.js";
import VelocitiesPanel from "./velocities/VelocitiesPanel.js";
import AccelerationsPanel from "./accelerations/AccelerationsPanel.js";
import TrayectoryMaxSpeedPanel from "./trajectoryMaxSpeed/TrajectoryPanelMaxSpeed";
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import {useSessionDataContext} from "../../../context/SessionDataContext";
import {DriverContextConsumer, DriverContextProvider} from "../../../context/DriverContext";
import {LapContextConsumer, LapContextProvider} from "../../../context/LapContext";
import {KinematicVectorsProvider} from "../../../context/KinematicVectorsContext";
import ComparativePanel from "./comparative/ComparativePanel.js";
import PositionsPanel from "./positions/PositionsPanel";
import FrictionsPanel from "./frictions/FrictionsPanel";

export default function MainPanel({className}) {
    const {year, round, session} = useSessionDataContext();

    return <div className={"w-full text-white h-screen bg-[hsl(218,80,5)] overflow-clip " + className}>
        <DriverContextProvider year={year} round={round} session={session}>
            <DriverContextConsumer>
                {driverData =>
                    <LapContextProvider year={year} round={round} session={session}
                                        selectedDriver={driverData.currentDriver ? driverData.currentDriver.driverNumber : null}>
                        <LapContextConsumer>
                            {lapData =>
                                <KinematicVectorsProvider currentDriver={driverData.currentDriver} session={session} round={round} year={year} currentLap={lapData.currentLap}>
                                    <Tabs className=" h-full flex flex-col"
                                            selectedTabPanelClassName="react-tabs__tab-panel--selected grow"
                                            selectedTabClassName="bg-gray-500 rounded-t-xl rounded-tr-xl">
                                        <TabList>
                                            <Tab>Trayectoria</Tab>
                                            <Tab disabled={driverData.drivers === null ? true : null}>Posiciones</Tab>
                                            <Tab disabled={driverData.drivers === null ? true : null}>Velocidades</Tab>
                                            <Tab disabled={driverData.drivers === null ? true : null}>Aceleraciones</Tab>
                                            <Tab disabled={driverData.drivers === null ? true : null}>Comparativas</Tab>
                                            <Tab disabled={driverData.drivers === null ? true : null}>Velocidad en trayectoria</Tab>
                                            <Tab disabled={driverData.drivers === null ? true : null}>Rozamiento</Tab>
                                        </TabList>

                                        <TabPanel className="overflow-clip">
                                            <TrajectoryPanel className="grow"/>
                                        </TabPanel>
                                        <TabPanel className="overflow-clip">
                                            <PositionsPanel className="h-full"/>
                                        </TabPanel>
                                        <TabPanel className="overflow-clip">
                                            <VelocitiesPanel className="h-full"/>
                                        </TabPanel>
                                        <TabPanel className="overflow-clip">
                                            <AccelerationsPanel className="h-full"/>
                                        </TabPanel>
                                        <TabPanel className="overflow-clip">
                                            <ComparativePanel className="h-full"/>
                                        </TabPanel>
                                        <TabPanel className="overflow-clip">
                                             <TrayectoryMaxSpeedPanel className="h-full"/>
                                        </TabPanel>
                                        <TabPanel className="overflow-clip">
                                             <FrictionsPanel className="h-full"/>
                                        </TabPanel>
                                    </Tabs>
                                </KinematicVectorsProvider>
                            }
                        </LapContextConsumer>
                    </LapContextProvider>
                }
            </DriverContextConsumer>
        </DriverContextProvider>
    </div>
}