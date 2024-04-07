import fastapi
from fastapi.middleware.cors import CORSMiddleware
from util import timedelta_to_string, timestamp_to_string, calcular_vector_velocidad, string_to_timedelta
from f1data.FastF1Facade import FastF1Facade as FastF1Facade
from placeholders import driversPlaceholder, lapsPlaceholder, trajectoryPlaceholder, vectorsPlaceholder, \
    accelerationsPlaceholder
import pandas as pd


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

    elementos_con_tiempo_final = lap_telemetry[lap_telemetry["Time"] == string_to_timedelta(time)]
    #TODO manejar caso donde el tiempo no existe (dar error 4xx)

    elemento_final_index = elementos_con_tiempo_final.index[0]
    elemento_final = elementos_con_tiempo_final.iloc[0]

    elemento_inicial = 0  # inicializamos elemento_inicial

    if (elemento_final_index == 0):
        if (lapNumber == 1):
            print("Vuelta inicial, velocidad 0")
            return []

        else:
            print("Ver vuelta anterior")
            return []
    else:
        elemento_inicial = lap_telemetry.iloc[elemento_final_index - 1]

    vector_speed = calcular_vector_velocidad(elemento_final, elemento_inicial)

    vector_velocidad_x = vector_speed[0]["vX"]
    vector_velocidad_y = vector_speed[0]["vY"]
    vector_velocidad_z = vector_speed[0]["vZ"]
    modulo_velocidad = vector_speed[0]["module"]
    velocimetro = vector_speed[0]["speedometer"] / 3.6 * 10

    # Aceleracion

    elemento_previo_inicial = lap_telemetry.iloc[elemento_final_index - 2]

    vector_speed_prev = calcular_vector_velocidad(elemento_inicial, elemento_previo_inicial)
    vector_previo_velocidad_x = vector_speed_prev[0]["vX"]
    vector_previo_velocidad_y = vector_speed_prev[0]["vY"]
    vector_previo_velocidad_z = vector_speed_prev[0]["vZ"]

    aceleracion_x = (vector_velocidad_x - vector_previo_velocidad_x) / (elemento_final["Time"] - elemento_inicial["Time"]).total_seconds()
    aceleracion_y = (vector_velocidad_y - vector_previo_velocidad_y) / (elemento_final["Time"] - elemento_inicial["Time"]).total_seconds()
    aceleracion_z = (vector_velocidad_z - vector_previo_velocidad_z) / (elemento_final["Time"] - elemento_inicial["Time"]).total_seconds()

    modulo_aceleracion = (aceleracion_x ** 2 + aceleracion_y ** 2 + aceleracion_z ** 2) ** 0.5

    # TODO averiguar como calcular la normal y la tangencial
    aTangencial = 0.5
    aNormal = 0.5

    vectorsPlaceholder = {
            "speed": {
                "vX": vector_velocidad_x.item(),
                "vY": vector_velocidad_y.item(),
                "vZ": vector_velocidad_z.item(),
                "module": modulo_velocidad.item(),
                "speedometer": velocimetro.item()
            },

            "acceleration": {
                "aX": aceleracion_x.item(),
                "aY": aceleracion_y.item(),
                "aZ": aceleracion_z.item(),
                "module": modulo_aceleracion.item(),
                "aTangential": aTangencial,
                "aNormal": aNormal
            }
        }

    return vectorsPlaceholder


@app.get("/accelerations")
def accelerations(year: int, roundNumber: int, sessionNumber: int, driverNumber: int, lapNumber: int):
    # TODO implementar
    return accelerationsPlaceholder


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=3002)
