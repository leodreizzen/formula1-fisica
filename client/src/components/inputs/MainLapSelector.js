import {Pagination} from "@mui/material";
import {useEffect, useState} from "react";
import { TbExchange } from "react-icons/tb";
import {useLapContext} from "../../context/LapContext";
import {OrbitProgress} from "react-loading-indicators";
import LapSelector from "./LapSelector";

export default function MainLapSelector({className}) {
    const {lapCount, currentLap, setCurrentLap} = useLapContext();
    return <LapSelector className={className} lapCount={lapCount} currentLap={currentLap} onCurrentLapChange={setCurrentLap}/>
}