import {useDriverContext} from "../../context/DriverContext";
import DriverSelector from "./DriverSelector";

export default function MainDriverSelector({className}) {
    const {currentDriver, setCurrentDriver} = useDriverContext();
    return <DriverSelector className={className} currentDriver={currentDriver} onDriverChange={setCurrentDriver}/>
}