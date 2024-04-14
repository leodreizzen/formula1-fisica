import {useEffect, useState} from "react";
import {CiSearch} from "react-icons/ci";
import {useGetRounds} from "../api/hooks.js"
import {MdOutlineMenu, MdOutlineMenuOpen} from "react-icons/md";
import SessionSelector from "./SessionSelector";

export default function SelectionMenu({className, loadData}) {
    const [visible, setVisible] = useState(true);
    const [yearInput, setYearInput] = useState(0);

    const [searchedYear, setSearchedYear] = useState(null);
    const [rounds, roundsLoading] = useGetRounds(searchedYear);


    const [isMenuVisible, setMenuVisible] = useState(true)

    function onYearChange(event) {
        setYearInput(event.target.value);
    }

    function onSearchClick() {
        setSearchedYear(yearInput)
    }

    function onMenuClick(){
         isMenuVisible? setMenuVisible(false): setMenuVisible(true);
         setVisible(isMenuVisible);
    }

    function handleLoadDataClick(roundNumber, sessionNumber) {
        loadData(searchedYear, roundNumber, sessionNumber);
    }

    const handleKeyDown = e => {
     if (e.key === 'Enter') {
        onSearchClick();
    }
  };
    const roundsLoaded = rounds !== null;

    if (visible) {
        return (
            <div id="" className={className + " bg-[hsl(218,80,8)] text-white flex flex-col items-center px-3  border-r-2 border-gray-400 h-full"}>
                <MdOutlineMenuOpen className={"text-white border border-gray-400 my-4 w-8 h-8 rounded-md "} id="menu" type="button" onClick={onMenuClick}/>
                <label className={"block mb-1 text-white"} htmlFor="year">Año</label>
                <div className={"flex "}>
                    <input type="number" className={"text-white block border border-gray-400 rounded-md remove-arrow bg-gray-900"} placeholder="ej: 2023" onChange={onYearChange} onKeyDown={handleKeyDown}/>
                    <button className={"text-white border border-gray-400 rounded-md ml-1"} onClick={onSearchClick}><CiSearch/></button>
                </div>
                {roundsLoaded ?  <SessionSelector className="w-full" rounds={rounds} onLoadDataClick={handleLoadDataClick}/> : null}
            </div>
        )
    } else return (
        <div className={className + " bg-[hsl(218,80,5)] top-0 h-auto text-white"}>
            <MdOutlineMenu
                className={"text-white my-5 h-8 w-8 border border-gray-400 rounded-md"}
                id="menu"
                type="button"
                onClick={onMenuClick}
            />
        </div>
    );
}

