import {createContext, useContext} from "react";

export const SessionDataContext = createContext(null);

export function useSessionDataContext(){
    const context = useContext(SessionDataContext);
    if (!context) {
        throw new Error('useSessionDataContext must be used within a SessionDataContextProvider');
    }
    return context;
}