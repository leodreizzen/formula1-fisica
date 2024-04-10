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

function valueExists(val) {
    return val !== null && val !== undefined;
}

export function useGetRounds(year) {
    const params = [year]
    const [res, isLoading] = useGetFromAPI((options) => getRounds(...params, options), params, year !== null)
    return [res, isLoading]
}

export function useGetDrivers(year, roundNumber, sessionNumber) {
    const params = [year, roundNumber, sessionNumber]

    const validData = valueExists(year) && valueExists(roundNumber) && valueExists(sessionNumber);
    const [drivers, isLoading] = useGetFromAPI((options) => getDrivers(...params, options), params, validData);
    return [drivers, isLoading]
}

export function useGetLaps(year, roundNumber, sessionNumber, driverNumber) {
    const params = [year, roundNumber, sessionNumber, driverNumber];

    const validData = valueExists(year) && valueExists(roundNumber) && valueExists(sessionNumber) && valueExists(driverNumber);

    const [laps, isLoading] = useGetFromAPI((options) => getLaps(...params, options), params, validData);
    return [laps, isLoading]
}

export function useGetTrajectory(year, roundNumber, sessionNumber, driverNumber, lapNumber) {
    const params = [year, roundNumber, sessionNumber, driverNumber, lapNumber];

    const validData = valueExists(year) && valueExists(roundNumber) && valueExists(sessionNumber) && valueExists(driverNumber) && valueExists(lapNumber);

    const [trajectory, isLoading] = useGetFromAPI((options) => getTrajectory(...params, options), params, validData);
    return [trajectory, isLoading]
}