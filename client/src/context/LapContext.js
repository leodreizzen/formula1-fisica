import {createContext, useContext, useEffect, useState} from "react";
import {useGetLaps} from "../api/hooks";
import {useStateWithDeps} from "use-state-with-deps";

const LapContext = createContext(null);

export function LapContextProvider({year, round, session, selectedDriver, ...props}) {
    const [lapData, lapDataLoading] = useGetLaps(year, round, session, selectedDriver);
    const [currentLap, setCurrentLap] = useStateWithDeps(null, [lapData, year, round, session, selectedDriver]);
    useEffect(() => {
        if (lapData && lapData.lapCount > 0) {
            setCurrentLap(1);
        }
    }, [lapData]);

    const value = {
        lapCount: lapData ? lapData.lapCount : null,
        lapDataLoading: lapDataLoading,
        fastestLap: lapData ? lapData.fastestLap : null,
        currentLap: currentLap,
        setCurrentLap: setCurrentLap
    }
    return <LapContext.Provider value={value} {...props}/>
}

export function useLapContext(){
    const context = useContext(LapContext);
    if (!context) {
        throw new Error('useLapContext must be used within a LapContextProvider');
    }
    return context;
}

export function LapContextConsumer({children}){
    return <LapContext.Consumer>
        {value => {
            if (!value) {
                throw new Error('LapContextConsumer must be used within a LapContextProvider');
            }
            return children(value)
        }
        }
    </LapContext.Consumer>
}

