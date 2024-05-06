import {Pagination} from "@mui/material";
import {useEffect, useState} from "react";
import { TbExchange } from "react-icons/tb";
import {useLapContext} from "../../context/LapContext";
import {OrbitProgress} from "react-loading-indicators";

export default function LapSelector({className}) {
    const {lapCount, currentLap, setCurrentLap} = useLapContext();
    const [currentLapInput, setCurrentLapInput] = useState(currentLap);

    useEffect(() => {
        if(currentLap !== null)
            setCurrentLapInput(currentLap);
    }, [currentLap]);

    function buttonClick(){
        setCurrentLap(currentLapInput);
    }
    function onPaginationChange(event, value){
        setCurrentLap(value);
        setCurrentLapInput(value);
    }

    function onLapInputChange(event) {
        let value = Number(event.target.value);
            setCurrentLapInput(Math.min(value, lapCount));
    }

    const handleKeyDown = e => {
        if (e.key === 'Enter') {
            buttonClick();
        }
    }

    return (lapCount !== null?

            <div className={"flex flex-col sm:flex-row items-center border-2 border-gray-400 rounded-md pl-2 mt-4 " + className}>
                <>
                    <p className="mr-2 text-white">Vuelta</p>
                    <input type="number" min={1}
                           className="bg-[#8F8F8F] w-10 max-h-10 h-[90%] border-2 border-black rounded-lg p-2 mr-2 remove-arrow text-black text-center font-semibold"
                           value={currentLapInput.toString()}
                           onChange={onLapInputChange}
                           onKeyDown={handleKeyDown}
                    />
                    <button onClick={buttonClick} className={"border border-black my-4 text-white mr-1"}><TbExchange/>
                    </button>
                    {currentLap !== null && <Pagination variant="outlined" count={lapCount} page={currentLap} onChange={onPaginationChange}
                                className="grow"/>}
                </>
            </div>
                : <div className="py-2"><OrbitProgress/></div>

    )
}