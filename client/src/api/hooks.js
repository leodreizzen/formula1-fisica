import {useEffect, useState} from "react";
import axios from "axios";
import {getDrivers, getLaps, getRounds, getTrajectory, getAcceleration, getVectors} from "./getters";
import {useStateWithDeps} from "use-state-with-deps";

function useGetFromAPI(getter, dependencies, validParams) {
    const [res, setRes] = useStateWithDeps(null, dependencies)
    const [isLoading, setIsLoading] = useState(null)
    useEffect(() => {
        const abortController = new AbortController()
        if (validParams) {
            setIsLoading(true);
            getter({signal: abortController.signal})
                .then((res) => {
                    setRes(res);
                    setIsLoading(false);
                })
                .catch((err) => {
                    if (!axios.isCancel(err)) {
                        setIsLoading(false);
                        throw err; // TODO manejo de errores?}
                    }
                })
        } else if (res !== null)
            setRes(null)

        return () => {
            abortController.abort()
        }

    }, [...dependencies, validParams]);
    return [res, isLoading]
}

function createGetterWithParams(getter, params) {
    return (options) => getter(...params, options)
}

function useAPIHook(getter, requiredParams, optionalParams = []) {
    const allParams = [...requiredParams, ...optionalParams];
    return useGetFromAPI(createGetterWithParams(getter, allParams), allParams, requiredParams.every(valueExists));
}

function valueExists(val) {
    return val !== null && val !== undefined;
}

export function useGetRounds(year) {
    const [res, isLoading] = useAPIHook(getRounds, [year])
    return [res, isLoading]
}

export function useGetDrivers(year, roundNumber, sessionNumber) {
    const [drivers, isLoading] = useAPIHook(getDrivers, [year, roundNumber, sessionNumber])
    return [drivers, isLoading]
}

export function useGetLaps(year, roundNumber, sessionNumber, driverNumber) {
    const [laps, isLoading] = useAPIHook(getLaps, [year, roundNumber, sessionNumber, driverNumber])
    return [laps, isLoading]
}

export function useGetTrajectory(year, roundNumber, sessionNumber, driverNumber, lapNumber) {

    const [trajectory, isLoading] = useAPIHook(getTrajectory, [year, roundNumber, sessionNumber, driverNumber, lapNumber])
    return [trajectory, isLoading]
}

export function useGetAcceleration(year, roundNumber, sessionNumber, driverNumber, lapNumber){
    const [acceleration, isLoading] = useAPIHook(getAcceleration, [year, roundNumber, sessionNumber, driverNumber, lapNumber])
    return [acceleration, isLoading]
}

export function useGetVectors(year, roundNumber, sessionNumber, driverNumber, lapNumber, time){
    const [vectors, isLoading] = useAPIHook(getVectors, [year, roundNumber, sessionNumber, driverNumber, lapNumber, time])
    return [vectors, isLoading]
}
