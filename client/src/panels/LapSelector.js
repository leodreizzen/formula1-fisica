import {Pagination} from "@mui/material";
import { MdLastPage } from "react-icons/md";
import {useState} from "react";
import { TbExchange } from "react-icons/tb";


export default function LapSelector({className, lapCount, currentLap, changeCurrentLap}) {
    const [currentLapInput, setCurrentLapInput] = useState(currentLap);

    function buttonClick(){
        changeCurrentLap(currentLapInput);
    }
    function onPaginationChange(event, value){
        changeCurrentLap(value);
        setCurrentLapInput(value);
    }

    function onLapInputChange(event) {
        let value = Number(event.target.value);
            setCurrentLapInput(Math.min(value, lapCount));
    }

    const handleKeypress = e => {
        if (e.key === 'Enter') {
            buttonClick();
        }
    }

    return (<div className={"flex items-center border pl-2" + className}>
            <p className="mr-2">Vuelta</p>
            <input type="number" min={1}
                   className="resize-none w-8 h-10 border border-gray-300 rounded-sm p-2 mr-2 remove-arrow"
                   value={currentLapInput.toString()}
                   onChange={onLapInputChange}
                   onKeyPress={handleKeypress}
            />
            <button onClick={buttonClick} className={"border my-4 "}><TbExchange /></button>
            <Pagination count={lapCount} page={currentLap} onChange={onPaginationChange}/>
        </div>

    )
}