import math
from functools import lru_cache

import fastapi
from fastapi.middleware.cors import CORSMiddleware

from api.f1data.utilData import telemetry_interpolation, filter_telemetry

from utilFisica import calcular_coordenadas_polares
from util import timedelta_to_string, timestamp_to_string, string_to_timedelta
from f1data.FastF1Facade import FastF1Facade as FastF1Facade
import pandas as pd
import numpy as np
from placeholders import dynamicsPlaceholder
from numpy import cos, arctan2

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

    polar_origin_X = lap_telemetry["X"].iloc[0]
    polar_origin_Y = lap_telemetry["Y"].iloc[0]

    lap_telemetry = calcular_coordenadas_polares(lap_telemetry,polar_origin_X,polar_origin_Y)
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
                "z": row["Z"],
                "origin_x": polar_origin_X,
                "origin_y": polar_origin_Y
            },
            "intrinsic": {
                "s": arreglo_cumsum[index],
            },
            "time": timedelta_to_string(row["Time"])
        })
    return puntos


@app.get("/kinematics_vectors")
def kinematics_vectors(year: int, roundNumber: int, sessionNumber: int, driverNumber: int, lapNumber: int):
    lap_telemetry = vector_calcs(year, roundNumber, sessionNumber, driverNumber, lapNumber)

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
                "r_dot": row["r_dot"],
                "theta_dot": row["theta_dot"],
                "speedometer": row["Speed"]
            },
            "acceleration": {
                "aX": row["aceleracion_x"],
                "aY": row["aceleracion_y"],
                "aZ": row["aceleracion_z"],
                "module": row["modulo_aceleracion"],
                "moduleXY": row["modulo_aceleracion_xy"],
                "aTangential": row["aTangential"],
                "aNormal": row["a_normal"],
                "r_double_dot": row["r_double_dot"],
                "theta_double_dot": row["theta_double_dot"]
            }
        })

    return aceleraciones


@app.get("/drifts")
def drifts(year: int, roundNumber: int, sessionNumber: int, driverNumber: int, lapNumber: int):
    datos_aceleraciones = vector_calcs(year, roundNumber, sessionNumber, driverNumber, lapNumber)
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


@app.get("/dynamics")
def dynamics(year: int, roundNumber: int, sessionNumber: int, driverNumber: int, lapNumber: int):
    dynamic = dynamicsPlaceholder

    return dynamic


@app.get("/kinematics_comparison")
def kinematics_comparison(year: int, roundNumber: int, sessionNumber: int, driverNumber1: int, driverNumber2: int,
                          lapNumber: int):
    driver_1_data = facade.telemetry(year, roundNumber, sessionNumber, driverNumber1, lapNumber, False)
    driver_2_data = facade.telemetry(year, roundNumber, sessionNumber, driverNumber2, lapNumber, False)

    # Obtener vector que va entre el primer y segundo punto del primer conductor
    # Trazar perpendicular entre el vector y el primer punto de driver2. Ver si la intersección está en el mismo sentido o al revés

    t = proyectar(driver_1_data["X"][0],
                  driver_1_data["X"][1],
                  driver_1_data["Y"][0],
                  driver_1_data["Y"][1],
                  driver_2_data["X"][0],
                  driver_2_data["Y"][0]
                  )[0]

    # Si t>=0, el primer conductor empezó antes. Si no, empezó antes el segundo.

    #Buscar punto más cercano al primero del otro
    if t >= 0:
        index = nearest_point(driver_1_data, driver_2_data["X"][0], driver_2_data["Y"][0])
        nuevo_t, proyeccion = proyectar(driver_1_data["X"][index], driver_1_data["X"][index + 1],
                                        driver_1_data["Y"][index], driver_1_data["Y"][index + 1], driver_2_data["X"][0],
                                        driver_2_data["Y"][0])
        if nuevo_t < 0 and index > 0:
            index -= 1
            nuevo_t, proyeccion = proyectar(driver_1_data["X"][index], driver_1_data["X"][index + 1],
                                            driver_1_data["Y"][index], driver_1_data["Y"][index + 1],
                                            driver_2_data["X"][0], driver_2_data["Y"][0])
        parte_izq = driver_1_data.head(index + 1)
        parte_der = driver_1_data.iloc[index + 1:]

        parte_izq = pd.concat([parte_izq,
                               pd.DataFrame(
                                   {"X": proyeccion[0], "Y": proyeccion[1], "Speed": parte_izq["Speed"][index]})
                               ], copy=True)

        parte_der = pd.concat([
            pd.DataFrame(
                {"X": proyeccion[0], "Y": proyeccion[1], "Speed": parte_izq["Speed"][index]}),
            parte_der,
        ], copy=True)

        # TODO: Interpolar a cada mitad, teniendo cuidado que el punto (index) coincida
        # TODO: Calcular intrínsecas, haciendo negativo en la parte izquierda
        # TODO: Juntar mitades


    else:
        index = nearest_point(driver_2_data, driver_1_data["X"][0], driver_1_data["Y"][0])
        nuevo_t, proyeccion = proyectar(driver_2_data["X"][index], driver_2_data["X"][index + 1],
                                        driver_2_data["Y"][index], driver_2_data["Y"][index + 1], driver_1_data["X"][0],
                                        driver_1_data["Y"][0])
        if nuevo_t < 0 and index > 0:
            index -= 1
            nuevo_t, proyeccion = proyectar(driver_2_data["X"][index], driver_2_data["X"][index + 1],
                                            driver_2_data["Y"][index], driver_2_data["Y"][index + 1],
                                            driver_1_data["X"][0],
                                            driver_1_data["Y"][0])
            parte_izq = driver_2_data.head(index + 1)
            parte_der = driver_2_data.iloc[index + 1:]


def proyectar(x1, x2, y1, y2, x, y):
    # (x_1 + t(x_2 - x_1) - x_3)(x_2 - x_1) + (y_1 + t(y_2 - y_1) - y_3)(y_2 - y_1) = 0

    # Calcula el numerador de la expresión
    numerador = (-x1 * x2 + x1 ** 2 + x2 * x - x1 * x - y1 * y2 + y1 ** 2 + y2 * y - y1 * y)

    # Calcula el denominador de la expresión
    denominador = (x2 ** 2 - 2 * x1 * x2 + x1 ** 2 + y2 ** 2 - 2 * y1 * y2 + y1 ** 2)

    # Calcula el valor de t
    t = numerador / denominador
    proyeccion = np.array([x1 + t * (x2 - x1), y1 + t * (y2 - y1)])
    return (t, proyeccion)


def nearest_point(telemetry, x, y):
    # Se busca entre el primer 10%
    cant_filas_buscar = len(telemetry) * 0.1
    filas = telemetry.head(cant_filas_buscar)

    dx = telemetry["X"] - x
    dy = telemetry["Y"] - y
    distancia = np.sqrt(dx ** 2 + dy ** 2)

    min = np.argmin(distancia)
    return min


@lru_cache(maxsize=tamano_cache)
def vector_calcs(year: int, roundNumber: int, sessionNumber: int, driverNumber: int, lapNumber: int):
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

    # Coordenadas polares

    polar_origin_X = lap_telemetry["X"].iloc[0]
    polar_origin_Y = lap_telemetry["Y"].iloc[0]
    lap_telemetry = calcular_coordenadas_polares(lap_telemetry, polar_origin_X, polar_origin_Y)

    lap_telemetry['r_dot'] = (lap_telemetry['r'].diff() / lap_telemetry['diferencia_tiempo']).fillna(0)
    lap_telemetry['theta_dot'] = (lap_telemetry['theta'].diff() / lap_telemetry['diferencia_tiempo']).fillna(0)

    lap_telemetry['r_double_dot'] = (
            (lap_telemetry['r_dot'].shift(-1) - lap_telemetry['r_dot']) / lap_telemetry['diferencia_tiempo']).fillna(
        0).replace([np.inf, -np.inf], 0)
    lap_telemetry['theta_double_dot'] = (
            (lap_telemetry['theta_dot'].shift(-1) - lap_telemetry['theta_dot']) / lap_telemetry['diferencia_tiempo']).fillna(
        0).replace([np.inf, -np.inf], 0)

    # Si la aceleración normal es negativa, invertimos el versor normal y la aceleración normal
    a_negativa = lap_telemetry['a_normal'] < 0
    lap_telemetry.loc[a_negativa, 'a_normal'] *= -1
    lap_telemetry.loc[a_negativa, 'versor_normal_x'] *= -1
    lap_telemetry.loc[a_negativa, 'versor_normal_y'] *= -1

    # Eliminar las primeras dos filas
    # La primera fila no tiene datos de velocidad, y en la segunda el theta punto no es fiable ya que en el punto anterior no hay radio
    lap_telemetry = lap_telemetry.iloc[2:]

    # Eliminar la última fila
    lap_telemetry = lap_telemetry.iloc[:-1]

    lap_telemetry.reset_index(drop=True, inplace=True)

    lap_telemetry['Speed'] = lap_telemetry["Speed"] / 3.6 * 10

    return lap_telemetry


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=3002)
