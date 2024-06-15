import { useEffect, useState } from "react";
import axios from "axios";
import { getDrivers, getLaps, getRounds, getTrajectory, getKinematicVectors, getNeckForces, getDrifts, getDynamics } from "./getters";
import { useStateWithDeps } from "use-state-with-deps";

function useGetFromAPI(getter, dependencies, validParams) {
    const [res, setRes] = useStateWithDeps(null, dependencies)
    const [isLoading, setIsLoading] = useState(null)
    useEffect(() => {
        const abortController = new AbortController()
        if (validParams) {
            setIsLoading(true);
            getter({ signal: abortController.signal })
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

export function useGetNeckForces(year, roundNumber, sessionNumber, driverNumber, lapNumber) {
    const [neckForces, isLoading] = useAPIHook(getNeckForces, [year, roundNumber, sessionNumber, driverNumber, lapNumber])
    return [neckForces, isLoading]
}

export function useGetKinematicVectors(year, roundNumber, sessionNumber, driverNumber, lapNumber) {
    const [vectors, isLoading] = useAPIHook(getKinematicVectors, [year, roundNumber, sessionNumber, driverNumber, lapNumber])
    return [vectors, isLoading]
}

export function useGetDrifts(year, roundNumber, sessionNumber, driverNumber, lapNumber) {
    const [drifting, isLoading] = useAPIHook(getDrifts, [year, roundNumber, sessionNumber, driverNumber, lapNumber])
    return [drifting, isLoading]
}

export function useGetDynamics(year, roundNumber, sessionNumber, driverNumber, lapNumber) {
    const [dynamic, isLoading] = useAPIHook(getDynamics, [year, roundNumber, sessionNumber, driverNumber, lapNumber])
    return [dynamic, isLoading]
}
