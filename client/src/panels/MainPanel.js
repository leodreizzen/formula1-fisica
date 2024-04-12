import TrajectoryPanel from "./TrajectoryPanel.js";
import AccelerationsPanel from "./AccelerationsPanel.js";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import {useContext, useEffect, useState} from "react";
import {getDrivers} from "../api/getters";
import {SessionDataContext} from "../context/SessionDataContext";


export default function MainPanel({className}) {
    const {year, round, session} = useContext(SessionDataContext);
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
    
    return <div className={"w-full text-white h-screen bg-[#010409] " + className} >
        <Tabs className=" h-full flex flex-col" selectedTabPanelClassName="react-tabs__tab-panel--selected grow">
        <TabList>
          <Tab>Trayectoria</Tab>
          <Tab disabled={areTabsDisabled}>Aceleraciones</Tab>
        </TabList>

        <TabPanel>
          <TrajectoryPanel
                           drivers={drivers}
                           selectedDriver={selectedDriver} onSelectedDriverChange = {handlerDriverChange}
                           currentLap ={currentLap} onLapChange = {setCurrentLap}/>
        </TabPanel>
        <TabPanel>
          <AccelerationsPanel drivers={drivers} selectedDriver={selectedDriver} onSelectedDriverChange={handlerDriverChange} lap={currentLap} className="h-full" />
        </TabPanel>
        </Tabs>
    </div>
}