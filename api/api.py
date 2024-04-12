import fastapi
import json
from fastapi.middleware.cors import CORSMiddleware
from utilFisica import calcular_vector_velocidad, calcular_vector_aceleracion
from util import timedelta_to_string, timestamp_to_string, string_to_timedelta
from f1data.FastF1Facade import FastF1Facade as FastF1Facade
from placeholders import driversPlaceholder, lapsPlaceholder, trajectoryPlaceholder, vectorsPlaceholder, \
    accelerationsPlaceholder
import pandas as pd
import numpy as np

app = fastapi.FastAPI()
facade = FastF1Facade()

origins = ["*"]

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
    puntos = []
    for index, row in lap_telemetry.iterrows():
        puntos.append({
            "x": row["X"],
            "y": row["Y"],
            "z": row["Z"],
            "time": timedelta_to_string(row["Time"])
        })
    return puntos


@app.get("/vectors")
def vectors(year: int, roundNumber: int, sessionNumber: int, driverNumber: int, lapNumber: int, time: str):
    lap_telemetry = facade.telemetry(year, roundNumber, sessionNumber, driverNumber, lapNumber)

    tiempo_pedido = string_to_timedelta(time)
    tiempo_min = tiempo_pedido - pd.Timedelta(microseconds=500)
    tiempo_max = tiempo_pedido + pd.Timedelta(milliseconds=1)

    elementos_con_tiempo_final = lap_telemetry[(lap_telemetry['Time'] >= tiempo_min) & (lap_telemetry['Time'] < tiempo_max)]

    # TODO manejar caso donde el tiempo no existe (dar error 4xx)

    elemento_final_index = elementos_con_tiempo_final.index[0]
    elemento_final = elementos_con_tiempo_final.iloc[0]

    elemento_inicial = 0  # inicializamos elemento_inicial

    if (elemento_final_index == 0):
        if (lapNumber == 1):
            elemento_inicial = elemento_final

        else:  # si el elemento es el primer punto que tenemos en la vuelta nos fijamos el ultimo de la anterior
            prev_lap_telemetry = facade.telemetry(year, roundNumber, sessionNumber, driverNumber, lapNumber - 1)
            elemento_inicial = prev_lap_telemetry.tail(1)[0]
    else:
        elemento_inicial = lap_telemetry.iloc[elemento_final_index - 1]
    vector_speed = calcular_vector_velocidad(elemento_final, elemento_inicial)

    modulo_velocidad = np.linalg.norm(vector_speed)
    velocimetro = elemento_final["Speed"]

    # Aceleracion

    if lap_telemetry.tail(1).index[0] == elemento_final_index:  # Si es el ultimo punto de la vuelta

        if lapNumber == facade.lapCount(year, sessionNumber,
                                        driverNumber):  # si es la ultima vuelta devolvemos el mismo punto
            elemento_siguiente_final = elemento_final

        else:  # Sino buscamos el primer punto de la siguiente vuelta
            next_lap_telemetry = facade.telemetry(year, roundNumber, sessionNumber, driverNumber, lapNumber + 1)
            elemento_siguiente_final = next_lap_telemetry.iloc[0]
    else:
        elemento_siguiente_final = lap_telemetry.iloc[elemento_final_index + 1]

    time_delta = (elemento_final["Time"] - elemento_inicial["Time"]).total_seconds()

    vector_speed_siguiente = calcular_vector_velocidad(elemento_siguiente_final, elemento_inicial)

    vector_aceleracion = calcular_vector_aceleracion(vector_speed_siguiente, vector_speed, time_delta)

    aceleracion_modulo = np.linalg.norm(vector_aceleracion)

    velocidad_XY = np.array([vector_speed[0], vector_speed[1]])
    modulo_velocidad_XY = np.linalg.norm(velocidad_XY)
    aceleracion_XY = np.array([vector_aceleracion[0], vector_aceleracion[1]])

    if modulo_velocidad_XY == 0:
        a_tangential = np.float64(0)
        a_normal = np.float64(0)
        versor_tangente = np.array([np.float64(0), np.float64(0)])
        versor_normal = np.array([np.float64(0), np.float64(0)])
    else:
        versor_tangente = velocidad_XY / np.linalg.norm(modulo_velocidad_XY)
        versor_normal = np.array([-versor_tangente[1], versor_tangente[0]])

        a_tangential = np.dot(aceleracion_XY, versor_tangente)
        a_normal = np.dot(aceleracion_XY, versor_normal)

        if a_normal < 0:
            versor_normal = -versor_normal
            a_normal = -a_normal

    return {
        "speed": {
            "vX": vector_speed[0].item(),
            "vY": vector_speed[1].item(),
            "vZ": vector_speed[2].item(),
            "module": modulo_velocidad.item(),
            "speedometer": velocimetro.item()
        },
        "versors": {
            "tangent": {
                'x': versor_tangente[0].item(),
                'y': versor_tangente[1].item()
            },
            "normal": {
                'x': versor_normal[0].item(),
                'y': versor_normal[1].item()
            }
        },
        "acceleration": {
            "aX": vector_aceleracion[0].item(),
            "aY": vector_aceleracion[1].item(),
            "aZ": vector_aceleracion[1].item(),
            "module": aceleracion_modulo.item(),
            "aTangential": a_tangential.item(),
            "aNormal": a_normal.item()
        }
    }


@app.get("/accelerations")
def accelerations(year: int, roundNumber: int, sessionNumber: int, driverNumber: int, lapNumber: int):
    # TODO implementar
    return accelerationsPlaceholder


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=3002)
