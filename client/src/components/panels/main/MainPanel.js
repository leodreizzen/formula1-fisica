import TrajectoryPanel from "./trajectory/TrajectoryPanel.js";
import VelocitysPanel from "./velocitys/VelocitysPanel.js";
import AccelerationsPanel from "./accelerations/AccelerationsPanel.js";
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import {useSessionDataContext} from "../../../context/SessionDataContext";
import {DriverContextConsumer, DriverContextProvider} from "../../../context/DriverContext";
import {LapContextConsumer, LapContextProvider} from "../../../context/LapContext";
import {VectorsProvider} from "../../../context/VectorsContext";

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
                                <VectorsProvider currentDriver={driverData.currentDriver} session={session} round={round} year={year} currentLap={lapData.currentLap}>
                                    <Tabs className=" h-full flex flex-col"
                                            selectedTabPanelClassName="react-tabs__tab-panel--selected grow"
                                            selectedTabClassName="bg-gray-500 rounded-t-xl rounded-tr-xl">
                                        <TabList>
                                            <Tab>Trayectoria</Tab>
                                            <Tab
                                                disabled={driverData.drivers === null ? true : null}>Aceleraciones</Tab>
                                            <Tab disabled={driverData.drivers === null ? true : null}>Velocidades</Tab>
                                        </TabList>

                                        <TabPanel className="overflow-clip">
                                            <TrajectoryPanel
                                                className="grow"/>
                                        </TabPanel>
                                        <TabPanel className="overflow-clip">
                                            <AccelerationsPanel className="h-full"/>
                                        </TabPanel>
                                        <TabPanel className="overflow-clip">
                                            <VelocitysPanel className="h-full"/>
                                        </TabPanel>
                                    </Tabs>
                                </VectorsProvider>
                            }
                        </LapContextConsumer>
                    </LapContextProvider>
                }
            </DriverContextConsumer>
        </DriverContextProvider>
    </div>
}