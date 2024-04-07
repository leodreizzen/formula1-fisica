import TrajectoryPanel from "./TrajectoryPanel.js";
import AccelerationsPanel from "./AccelerationsPanel.js";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';


export default function MainPanel({className, sessionData}) {
    return <div className={"w-full " + className}>
        <Tabs>
        <TabList>
          <Tab>Trayectoria</Tab>
          <Tab>Aceleraciones</Tab>
        </TabList>

        <TabPanel>
          <TrajectoryPanel sessionData={sessionData}/>
        </TabPanel>
        <TabPanel>
          <AccelerationsPanel sessionData={sessionData}/>
        </TabPanel>
        </Tabs>
    </div>
}