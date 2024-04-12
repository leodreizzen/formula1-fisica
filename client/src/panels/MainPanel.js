import TrajectoryPanel from "./TrajectoryPanel.js";
import AccelerationsPanel from "./AccelerationsPanel.js";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import {useEffect, useState} from "react";
import {useGetDrivers} from "../api/hooks";
import {getDrivers} from "../api/getters";


export default function MainPanel({className, sessionData}) {
    const year = sessionData !== null ? sessionData.year : null;
    const round = sessionData !== null ? sessionData.round : null;
    const session = sessionData !== null ? sessionData.session : null;

    const [drivers, setDrivers] = useState(null);
    const [areTabsDisabled, setTabs] = useState(true);

    useEffect(() => {
        if (year !== null && round !== null && session !== null) {
            getDrivers(year, round, session)
                .then((res) => {
                    setDrivers(res);
                    if(res.length > 0) {
                        setSelectedDriver(res[0].driverNumber);
                        setTabs(false);
                    }
                })
        }
    }, [year, round, session]);

    const [selectedDriver, setSelectedDriver] = useState(null)
    const [currentLap, setCurrentLap] = useState(null);
    const handlerDriverChange = (driverNum) => {
        setSelectedDriver(driverNum)
    }
    
    return <div className={"w-full h-screen" + className}>
        <Tabs className="h-full flex flex-col" selectedTabPanelClassName="react-tabs__tab-panel--selected grow">
        <TabList>
          <Tab>Trayectoria</Tab>
          <Tab disabled={areTabsDisabled}>Aceleraciones</Tab>
        </TabList>

        <TabPanel>
          <TrajectoryPanel sessionData={sessionData}
                           drivers={drivers}
                           selectedDriver={selectedDriver} onSelectedDriverChange = {handlerDriverChange}
                           currentLap ={currentLap} onLapChange = {setCurrentLap}/>
        </TabPanel>
        <TabPanel>
          <AccelerationsPanel sessionData={sessionData} drivers={drivers} selectedDriver={selectedDriver} onSelectedDriverChange={handlerDriverChange} lap={currentLap} className="h-full" />
        </TabPanel>
        </Tabs>
    </div>
}