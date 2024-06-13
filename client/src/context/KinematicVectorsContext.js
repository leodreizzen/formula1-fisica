import {createContext, useContext, useMemo} from "react";
import {useGetKinematicVectors} from "../api/hooks";

export const KinematicVectorContext = createContext(null);

export function KinematicVectorsProvider({year, round, session, currentDriver, currentLap, ...props}) {
    const [vectors, vectorsLoading] = useGetKinematicVectors(year, round, session, currentDriver?.driverNumber, currentLap)
    const vectorsMap = useMemo(() => {
        const vectorsMap = new Map();
        if (vectors !== null)
            vectors.forEach(vector => {
                const key = vector.time;
                vectorsMap.set(key, vector)
            })
        return vectorsMap;
    }, [vectors])
    function getKinematicVectorsFromTime(time){
        return vectorsMap.get(time);
    }
    const value = {vectors: vectors, vectorsLoading: vectorsLoading, getKinematicVectorsFromTime: getKinematicVectorsFromTime}
    return <KinematicVectorContext.Provider value={value} {...props}/>
}

export function useKinematicVectorsContext(){
    const context = useContext(KinematicVectorContext);
    if (!context) {
        throw new Error('useKinematicVectorsContext must be used within a KinematicVectorsProvider');
    }
    return context;
}

export function KinematicVectorsConsumer({children}){
    return <KinematicVectorContext.Consumer>
        {value => {
            if (!value) {
                throw new Error('KinematicVectorsConsumer must be used within a KinematicVectorsProvider');
            }
            return children(value)
        }
        }
    </KinematicVectorContext.Consumer>
}
