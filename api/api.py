import math
from functools import lru_cache

import fastapi
from fastapi.middleware.cors import CORSMiddleware
from util import timedelta_to_string, timestamp_to_string, string_to_timedelta
from f1data.FastF1Facade import FastF1Facade as FastF1Facade
import pandas as pd
import numpy as np


app = fastapi.FastAPI()
facade = FastF1Facade()

origins = ["*"]

tamano_cache = 1

# radio de giro para umbral = 7.35metros
wheelbase = 3.6
tire_width = 0.305
steering_angle_radians = math.radians(30)
radio_giro_minimo = (wheelbase / math.sin(steering_angle_radians)) + (tire_width / 2)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/rounds")
def rounds(year: int = None):
    rounds = facade.rounds(year)
    return [
        {
            "roundNumber": round.roundNumber,
            "country": round.country,
            "location": round.location,
            "eventName": round.eventName,
            "sessions": [
                {
                    "sessionNumber": session.sessionNumber,
                    "name": session.name,
                    "dateUTC": timestamp_to_string(session.date)
                }
                for session in round.sessions
            ]
        }
        for round in rounds
    ]


@app.get("/drivers")
def drivers(year: int, roundNumber: int, sessionNumber: int):
    return [
        {
            "driverNumber": driver.driverNumber,
            "fullName": driver.fullName,
            "countryCode": driver.countryCode,
            "teamName": driver.teamName,
            "teamColor": driver.teamColor
        }
        for driver in facade.drivers(year, roundNumber, sessionNumber)
    ]


@app.get("/laps")
def laps(year: int, roundNumber: int, sessionNumber: int, driverNumber: int):
    return {
        "lapCount": facade.lapCount(year, roundNumber, sessionNumber, driverNumber),
        "fastestLap": facade.fastestLap(year, roundNumber, sessionNumber, driverNumber),
    }


@app.get("/trajectory")
def trajectory(year: int, roundNumber: int, sessionNumber: int, driverNumber: int, lapNumber: int):
    lap_telemetry = facade.telemetry(year, roundNumber, sessionNumber, driverNumber, lapNumber)

    origen = np.sqrt(lap_telemetry["X"] ** 2 + lap_telemetry["Y"] ** 2 + lap_telemetry["Z"] ** 2).iloc[0]

    lap_telemetry['r'] = np.sqrt(lap_telemetry["X"] ** 2 + lap_telemetry["Y"] ** 2)
    lap_telemetry['theta'] = np.arctan2(lap_telemetry["Y"], lap_telemetry["X"])
    lap_telemetry['module'] = np.sqrt(lap_telemetry["X"].diff() ** 2 + lap_telemetry["Y"].diff() ** 2).fillna(0)

    arreglo_modulos = lap_telemetry["module"].to_numpy()
    arreglo_cumsum = np.cumsum(arreglo_modulos)

    puntos = []
    for index, row in lap_telemetry.iterrows():
        puntos.append({
            "cartesian": {
                "x": row["X"],
                "y": row["Y"],
                "z": row["Z"],
            },
            "polar": {
                "r": row["r"],
                "theta": row["theta"],
                "z": row["Z"]
            },
            "intrinsic": {
                "s": arreglo_cumsum[index],
            },
            "time": timedelta_to_string(row["Time"])
        })
    return puntos


@app.get("/kinematics_vectors")
def kinematics_vectors(year: int, roundNumber: int, sessionNumber: int, driverNumber: int, lapNumber: int):
    lap_telemetry = accelerations_calcs(year, roundNumber, sessionNumber, driverNumber, lapNumber)

    aceleraciones = []

    for index, row in lap_telemetry.iterrows():
        aceleraciones.append({
            "time": timedelta_to_string(row["Time"]),
            "versors": {
                "tangent": {
                    "x": row["versor_tangente"][0],
                    "y": row["versor_tangente"][1]
                },
                "normal": {
                    "x": row["versor_normal_x"],
                    "y": row["versor_normal_y"]
                }
            },
            "velocity": {
                "vX": row["velocidad_x"],
                "vY": row["velocidad_y"],
                "vZ": row["velocidad_z"],
                "module": row["modulo_velocidad"],
                "moduleXY": row["modulo_velocidad_xy"],
                "speedometer": row["Speed"]
            },
            "acceleration": {
                "aX": row["aceleracion_x"],
                "aY": row["aceleracion_y"],
                "aZ": row["aceleracion_z"],
                "module": row["modulo_aceleracion"],
                "moduleXY": row["modulo_aceleracion_xy"],
                "aTangential": row["aTangential"],
                "aNormal": row["a_normal"]
            }
        })

    return aceleraciones

  
@app.get("/drifts")
def drifts(year: int, roundNumber: int, sessionNumber: int, driverNumber: int, lapNumber: int):
    datos_aceleraciones = accelerations_calcs(year, roundNumber, sessionNumber, driverNumber, lapNumber)
    derrapes = []

    for index, row in datos_aceleraciones.iterrows():
        #pasaje de dm a m
        velocidad = row["modulo_velocidad"] / 10
        aceleracion_normal = row["a_normal"] / 10
        if aceleracion_normal != 0:
            radio = (velocidad ** 2) / aceleracion_normal
            if radio < radio_giro_minimo:
                proporcion = 1 - (radio / radio_giro_minimo)
                derrapes.append({
                    "time": timedelta_to_string(row["Time"]),
                    "x": row["X"],
                    "y": row["Y"],
                    "z": row["Z"],
                    "drifting": proporcion
                })

    return derrapes


@lru_cache(maxsize=tamano_cache)
def accelerations_calcs(year: int, roundNumber: int, sessionNumber: int, driverNumber: int, lapNumber: int):
    # Parámetros del filtro de Savitzky-Golay
    window_length_speed = 15
    polyorder_speed = 2
    window_length_acceleration = 100
    polyorder_acceleration = 3

    lap_telemetry = facade.telemetry(year, roundNumber, sessionNumber, driverNumber, lapNumber)
    lap_telemetry['diferencia_tiempo'] = (lap_telemetry['Time'].diff().apply(lambda x: x.total_seconds())).fillna(0)
    lap_telemetry['velocidad_x'] = (lap_telemetry['X'].diff() / lap_telemetry['diferencia_tiempo']).fillna(0)
    lap_telemetry['velocidad_y'] = (lap_telemetry['Y'].diff() / lap_telemetry['diferencia_tiempo']).fillna(0)
    lap_telemetry['velocidad_z'] = (lap_telemetry['Z'].diff() / lap_telemetry['diferencia_tiempo']).fillna(0)
    lap_telemetry['aceleracion_x'] = (
            (lap_telemetry['velocidad_x'].shift(-1) - lap_telemetry['velocidad_x']) / lap_telemetry[
        'diferencia_tiempo']).fillna(0).replace([np.inf, -np.inf], 0)
    lap_telemetry['aceleracion_y'] = (
            (lap_telemetry['velocidad_y'].shift(-1) - lap_telemetry['velocidad_y']) / lap_telemetry[
        'diferencia_tiempo']).fillna(0).replace([np.inf, -np.inf], 0)
    lap_telemetry['aceleracion_z'] = (
            (lap_telemetry['velocidad_z'].shift(-1) - lap_telemetry['velocidad_z']) / lap_telemetry[
        'diferencia_tiempo']).fillna(0).replace([np.inf, -np.inf], 0)

    lap_telemetry['modulo_velocidad_xy'] = np.linalg.norm(lap_telemetry[['velocidad_x', 'velocidad_y']], axis=1)
    lap_telemetry['modulo_velocidad'] = np.linalg.norm(lap_telemetry[['velocidad_x', 'velocidad_y', "velocidad_z"]],
                                                       axis=1)
    lap_telemetry['modulo_aceleracion'] = np.linalg.norm(
        lap_telemetry[['aceleracion_x', 'aceleracion_y', "aceleracion_z"]], axis=1)
    lap_telemetry['modulo_aceleracion_xy'] = np.linalg.norm(lap_telemetry[['aceleracion_x', 'aceleracion_y']], axis=1)

    # Calculamos el versor tangente para cada fila
    versor_x_tangente = (lap_telemetry['velocidad_x'] / lap_telemetry['modulo_velocidad_xy']).fillna(0)
    versor_y_tangente = (lap_telemetry['velocidad_y'] / lap_telemetry['modulo_velocidad_xy']).fillna(0)

    # Creamos una nueva columna para el versor tangente
    lap_telemetry['versor_tangente'] = list(zip(versor_x_tangente, versor_y_tangente))

    lap_telemetry['aTangential'] = (
            lap_telemetry['aceleracion_x'] * lap_telemetry['versor_tangente'].apply(lambda x: x[0]) +
            lap_telemetry['aceleracion_y'] * lap_telemetry['versor_tangente'].apply(lambda x: x[1]))

    lap_telemetry['versor_normal_x'] = -lap_telemetry['versor_tangente'].apply(lambda x: x[1])
    lap_telemetry['versor_normal_y'] = lap_telemetry['versor_tangente'].apply(lambda x: x[0])

    # Calculamos la aceleración normal para cada fila
    lap_telemetry['a_normal'] = ((lap_telemetry['aceleracion_x'] * lap_telemetry['versor_normal_x']) +
                                 (lap_telemetry['aceleracion_y'] * lap_telemetry['versor_normal_y']))

    # Si la aceleración normal es negativa, invertimos el versor normal y la aceleración normal
    a_negativa = lap_telemetry['a_normal'] < 0
    lap_telemetry.loc[a_negativa, 'a_normal'] *= -1
    lap_telemetry.loc[a_negativa, 'versor_normal_x'] *= -1
    lap_telemetry.loc[a_negativa, 'versor_normal_y'] *= -1

    # Eliminar la primera fila
    lap_telemetry = lap_telemetry.iloc[1:]

    # Eliminar la última fila
    lap_telemetry = lap_telemetry.iloc[:-1]

    lap_telemetry['Speed'] = lap_telemetry["Speed"] / 3.6 * 10

    return lap_telemetry


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=3002)
