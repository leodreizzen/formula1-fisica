import TrajectoryPanel from "./TrajectoryPanel.js";
import AccelerationsPanel from "./AccelerationsPanel.js";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import {useContext, useEffect, useState} from "react";
import {getDrivers, getLaps} from "../api/getters";
import {SessionDataContext} from "../context/SessionDataContext";
import {useGetLaps} from "../api/hooks";


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
    const handlerDriverChange = (driverNum) => {
        setSelectedDriver(driverNum)
    }

    const [lapData, setLapData] = useState(null);
    const [currentLap, setCurrentLap] = useState(null);

    useEffect(() => {
        if (year !== null && round !== null && session !== null && selectedDriver !== null) {
            getLaps(year, round, session, selectedDriver)
                .then((res) => {
                    setLapData(res);
                    if(res.lapCount > 0) {
                        setCurrentLap(1)
                    }
                    else
                        setCurrentLap(null)
                })
        }
    }, [drivers, year, round, session]);


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
                           lapData={lapData}
                           currentLap={currentLap} onLapChange={setCurrentLap}/>
        </TabPanel>
        <TabPanel>
          <AccelerationsPanel drivers={drivers} lapData={lapData} selectedDriver={selectedDriver} onSelectedDriverChange={handlerDriverChange} currentLap={currentLap} className="h-full" />
        </TabPanel>
        </Tabs>
    </div>
}