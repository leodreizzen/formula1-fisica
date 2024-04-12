import TrajectoryPanel from "./TrajectoryPanel.js";
import AccelerationsPanel from "./AccelerationsPanel.js";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import {useState} from "react";
import DriverSelector from "./DriverSelector";


export default function MainPanel({className, sessionData}) {

    const [selectedDriver, setSelectedDriver] = useState(null)
    const [currentLap, setCurrentLap] = useState(null);
    const [areTabsDisabled, setTabs] = useState(true)

    const handlerDriverChange = (driverNum) => {
        if(selectedDriver === null) setTabs(false);
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
                           driver={selectedDriver} onDriverChange = {handlerDriverChange}
                           currentLap ={currentLap} onLapChange = {setCurrentLap}/>
        </TabPanel>
        <TabPanel>
          <AccelerationsPanel sessionData={sessionData} driver={selectedDriver} onDriverChange = {handlerDriverChange} lap={currentLap} className="h-full" />
        </TabPanel>
        </Tabs>
    </div>
}