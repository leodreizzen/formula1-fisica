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

    return (
        <div className={"flex flex-col sm:flex-row items-center border-2 border-gray-400 rounded-md pl-2 my-3 bg-[#8F8F8F] " + className}>
            <p className="mr-2 text-black">Vuelta</p>
            <input type="number" min={1}
                className="bg-[#8F8F8F] min-w-10 max-h-10 w-[7%] h-[90%] border-2 border-black rounded-lg p-2 mr-2 remove-arrow text-black"
                value={currentLapInput.toString()}
                onChange={onLapInputChange}
                onKeyPress={handleKeypress}
            />
            <button onClick={buttonClick} className={"border border-black my-4 text-black"}><TbExchange /></button>
            <Pagination color="primary"  count={lapCount} page={currentLap} onChange={onPaginationChange}/>
        </div>
    )
}