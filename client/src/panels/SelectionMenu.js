import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { useGetRounds } from "../api/hooks.js"
import { MdOutlineMenu, MdOutlineMenuOpen } from "react-icons/md";
import SessionSelector from "./SessionSelector";

export default function SelectionMenu({ className, loadData }) {
    const [visible, setVisible] = useState(true);
    const [yearInput, setYearInput] = useState("");

    const [searchedYear, setSearchedYear] = useState(null);
    const [rounds, roundsLoading] = useGetRounds(searchedYear);

    const [isMenuVisible, setMenuVisible] = useState(true)

    function onYearChange(event) {
        let input = event.target.value;

        //Leave only numbers, up to 4 digits
        input = input.replace(/[^0-9]/g, '');
        if (input.length > 4) {
            input = input.slice(0, 4);
        }

        setYearInput(input)
    }

    function onSearchClick() {
        setSearchedYear(yearInput)
    }

    function onMenuClick() {
        isMenuVisible ? setMenuVisible(false) : setMenuVisible(true);
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
            <div id="" className={className + " bg-[hsl(218,80,8)] text-white flex flex-col items-center px-3 border-r-2 border-gray-400 h-full"}>
                <div className="flex justify-end w-full">
                    <MdOutlineMenuOpen className={"text-white border border-gray-400 my-4 w-8 h-8 rounded-md"} id="menu" type="button" onClick={onMenuClick} />
                </div>
                <div className="w-full text-left">
                    <label className={"block mb-1 text-white p-1"} htmlFor="year">Año:</label>
                    <div className={"flex"}>
                        <input type="text" className={"text-white flex-grow block border border-gray-400 rounded-md remove-arrow bg-gray-900 p-1 pl-2"} placeholder="ej: 2023" value={yearInput} onChange={onYearChange} onKeyDown={handleKeyDown} /> {/* Agregar clase flex-grow para que el input ocupe el espacio restante */}
                        <button className={"text-white border border-gray-400 rounded-md ml-2 p-2"} onClick={onSearchClick}><CiSearch /></button>
                    </div>
                </div>
                {roundsLoaded ? <SessionSelector className="w-full" rounds={rounds} onLoadDataClick={handleLoadDataClick} /> : null}
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

