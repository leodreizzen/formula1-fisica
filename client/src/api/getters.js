import axios from "axios";
import { API_BASE_URL } from "../settings";

function APIGetter(endpoint, params, options) {
    return axios.get(API_BASE_URL + endpoint, {
        ...options,
        params: params
    }).then(response => response.data);
}

export function getRounds(year, options) {
    return APIGetter("/rounds", { year: year }, options);
}

export function getDrivers(year, roundNumber, sessionNumber, options) {
    return APIGetter("/drivers", {
        year: year,
        roundNumber: roundNumber,
        sessionNumber: sessionNumber
    }, options);
}

export function getLaps(year, roundNumber, sessionNumber, driverNumber, options) {
    return APIGetter("/laps", {
        year: year,
        roundNumber: roundNumber,
        sessionNumber: sessionNumber,
        driverNumber: driverNumber
    }, options);
}

export function getTrajectory(year, roundNumber, sessionNumber, driverNumber, lapNumber, options) {
    return APIGetter("/trajectory", {
        year: year,
        roundNumber: roundNumber,
        sessionNumber: sessionNumber,
        driverNumber: driverNumber,
        lapNumber: lapNumber
    }, options);
}

export function getNeckForces(year, roundNumber, sessionNumber, driverNumber, lapNumber, options) {
    return APIGetter("/neck_forces", {
        year: year,
        roundNumber: roundNumber,
        sessionNumber: sessionNumber,
        driverNumber: driverNumber,
        lapNumber: lapNumber
    }, options);
}

export function getKinematicVectors(year, roundNumber, sessionNumber, driverNumber, lapNumber, options){
     return APIGetter("/kinematics_vectors", {
        year: year,
        roundNumber: roundNumber,
        sessionNumber: sessionNumber,
        driverNumber: driverNumber,
        lapNumber: lapNumber
    }, options);
}


export function getDrifts(year, roundNumber, sessionNumber, driverNumber, lapNumber, options){
     return APIGetter("/drifts", {
         year: year,
         roundNumber: roundNumber,
         sessionNumber: sessionNumber,
         driverNumber: driverNumber,
         lapNumber: lapNumber
     }, options);
}

export function getDynamics(year, roundNumber, sessionNumber, driverNumber, lapNumber, options){
     return APIGetter("/dynamics", {
         year: year,
         roundNumber: roundNumber,
         sessionNumber: sessionNumber,
         driverNumber: driverNumber,
         lapNumber: lapNumber
     }, options);
}