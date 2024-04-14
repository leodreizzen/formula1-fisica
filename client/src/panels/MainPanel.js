import TrajectoryPanel from "./TrajectoryPanel.js";
import AccelerationsPanel from "./AccelerationsPanel.js";
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import {useSessionDataContext} from "../context/SessionDataContext";
import {DriverContextConsumer, DriverContextProvider} from "../context/DriverContext";
import {LapContextProvider} from "../context/LapContext";

export default function MainPanel({className}) {
    const {year, round, session} = useSessionDataContext();

    return <div className={"w-full text-white h-screen bg-[hsl(218,80,5)] overflow-clip " + className}>
        <DriverContextProvider year={year} round={round} session={session}>
            <DriverContextConsumer>
                {driverData =>
                    <LapContextProvider year={year} round={round} session={session}
                                        selectedDriver={driverData.currentDriver}>
                        <Tabs className=" h-full flex flex-col"
                              selectedTabPanelClassName="react-tabs__tab-panel--selected grow"
                              selectedTabClassName="bg-gray-500">
                            <TabList>
                                <Tab>Trayectoria</Tab>
                                <Tab disabled={driverData.drivers === null ? true : null}>Aceleraciones</Tab>
                            </TabList>

                            <TabPanel className="overflow-clip">
                                <TrajectoryPanel
                                    className="grow"/>
                            </TabPanel>
                            <TabPanel className="overflow-clip">
                                <AccelerationsPanel className="h-full"/>
                            </TabPanel>
                        </Tabs>
                    </LapContextProvider>
              }
            </DriverContextConsumer>
        </DriverContextProvider>
    </div>
}