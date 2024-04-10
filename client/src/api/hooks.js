import {useEffect, useMemo, useState} from "react";
import axios from "axios";
import {API_BASE_URL} from "../settings";
import {value} from "plotly.js/src/traces/indicator/attributes";
import {getDrivers, getLaps, getRounds, getTrajectory} from "./getters";

function useGetFromAPI(getter, dependencies, validParams) {
    const [res, setRes] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    useEffect(() => {
        const abortController = new AbortController()
        if (validParams) {
            setRes(null); // TODO VER si debería hacerse esto.
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
    const params = [year, roundNumber, sessionNumber, driverNumber, lapNumber];

    const [trajectory, isLoading] = useAPIHook(getTrajectory, [year, roundNumber, sessionNumber, driverNumber, lapNumber])
    return [trajectory, isLoading]
}
