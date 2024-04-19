import {createContext, useContext, useMemo} from "react";
import {useGetVectors} from "../api/hooks";

export const VectorContext = createContext(null);

export function VectorsProvider({year, round, session, currentDriver, currentLap, ...props}) {
    const [vectors, vectorsLoading] = useGetVectors(year, round, session, currentDriver?.driverNumber, currentLap)
    const vectorsMap = useMemo(() => {
        const vectorsMap = new Map();
        if (vectors !== null)
            vectors.forEach(vector => {
                const key = vector.time;
                vectorsMap.set(key, vector)
            })
        return vectorsMap;
    }, [vectors])
    function getVectorsFromTime(time){
        return vectorsMap.get(time);
    }
    const value = {vectors: vectors, vectorsLoading: vectorsLoading, getVectorsFromTime: getVectorsFromTime}
    return <VectorContext.Provider value={value} {...props}/>
}

export function useVectorsContext(){
    const context = useContext(VectorContext);
    if (!context) {
        throw new Error('useVectorsContext must be used within a VectorsProvider');
    }
    return context;
}

export function VectorsConsumer({children}){
    return <VectorContext.Consumer>
        {value => {
            if (!value) {
                throw new Error('VectorsConsumer must be used within a VectorsProvider');
            }
            return children(value)
        }
        }
    </VectorContext.Consumer>
}
