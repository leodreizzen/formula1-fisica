import {useEffect, useMemo, useState} from "react";
import axios from "axios";
import {API_BASE_URL} from "../settings";
import {value} from "plotly.js/src/traces/indicator/attributes";

function useGetFromAPI(endpoint, params, validParams) {
    const [res, setRes] = useState(null)
    const [isLoading, setIsLoading] = useState(null)

    useEffect(() => {
        const abortController = new AbortController()
        if (validParams) {
            setRes(null); // TODO VER si debería hacerse esto.
            setIsLoading(true);
            axios.get(API_BASE_URL + endpoint, {
                params: params,
                signal: abortController.signal
            })
                .then((res) => {
                    setRes(res.data)
                    setIsLoading(false)
                })
                .catch((err) => {
                    if (!axios.isCancel(err))
                        throw err; // TODO manejo de errores?
                })
        } else if (res !== null)
            setRes(null)

        return () => {
            abortController.abort()
        }

    }, [params, validParams]);
    return [res, isLoading]
}

function valueExists(val){
    return val !== null && val !== undefined;
}

export function useGetRounds(year) {
    const params = useMemo(() => ({year: year}), [year]);
    const [res, isLoading] = useGetFromAPI("/rounds", params, year !== null)
    return [res, isLoading]
}

export function useGetDrivers(year, roundNumber, sessionNumber) {
    const params = useMemo(() => {
        return {
            year: year,
            roundNumber: roundNumber,
            sessionNumber: sessionNumber
        }
    }, [year, roundNumber, sessionNumber]);

    const validData = valueExists(year) && valueExists(roundNumber) && valueExists(sessionNumber);
    const [drivers, isLoading] = useGetFromAPI("/drivers", params, validData);
    return [drivers, isLoading]
}

export function useGetLaps(year, roundNumber, sessionNumber, driverNumber) {
    const params = useMemo(() => {
        return {
            year: year,
            roundNumber: roundNumber,
            sessionNumber: sessionNumber,
            driverNumber: driverNumber
        }
    }, [year, roundNumber, sessionNumber, driverNumber]);

    const validData = valueExists(year) && valueExists(roundNumber) && valueExists(sessionNumber) && valueExists(driverNumber);

    const [laps, isLoading] = useGetFromAPI("/laps", params, validData);
    return [laps, isLoading]
}

export function useGetTrajectory(year, roundNumber, sessionNumber, driverNumber, lapNumber) {
    const params = useMemo(() => {
        return {
            year: year,
            roundNumber: roundNumber,
            sessionNumber: sessionNumber,
            driverNumber: driverNumber,
            lapNumber: lapNumber
        }
    }, [year, roundNumber, sessionNumber, driverNumber, lapNumber]);

    const validData = valueExists(year) && valueExists(roundNumber) && valueExists(sessionNumber) && valueExists(driverNumber) && valueExists(lapNumber);

    const [trajectory, isLoading] = useGetFromAPI("/trajectory", params, validData);
    return [trajectory, isLoading]
}