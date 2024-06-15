import math
from functools import lru_cache

import fastapi
from fastapi.middleware.cors import CORSMiddleware

from f1data.F1IntrinsicsHelper import F1IntrinsicsHelper
from utilFisica import calcular_coordenadas_polares,vector_calcs, dynamics_calcs, getKinematicVectorsWithAlignedIntrinsics
from util import timedelta_to_string, timestamp_to_string
from f1data.FastF1Facade import FastF1Facade as FastF1Facade
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

    polar_origin_X = lap_telemetry["X"].iloc[0]
    polar_origin_Y = lap_telemetry["Y"].iloc[0]

    lap_telemetry = calcular_coordenadas_polares(lap_telemetry, polar_origin_X, polar_origin_Y)
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
    lap_telemetry = vector_data(year, roundNumber, sessionNumber, driverNumber, lapNumber)

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
    datos_aceleraciones = vector_data(year, roundNumber, sessionNumber, driverNumber, lapNumber)
    derrapes = []

    for index, row in datos_aceleraciones.iterrows():
        # pasaje de dm a m
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
    datos_aceleraciones = vector_data(year, roundNumber, sessionNumber, driverNumber, lapNumber)
    datos_dinamica, friction_coefficient, max_friction, avg_friction = dynamics_calcs(datos_aceleraciones)
    forces_array = []
    for index, row in datos_dinamica.iterrows():
        forces_array.append({
            "time": timedelta_to_string(row["Time"]),
            "x": row["X"],
            "y": row["Y"],
            "module_velocity_xy": row["modulo_velocidad_xy"],
            "friction": {
                "frx": row["friction_x"],
                "fry": row["friction_y"],
                "module": row["friction_module"],
                "tangential": row["friction_tangential"],
                "normal": row["friction_normal"],
                "hasMaxSpeed": row["hasMaxSpeed"],
                "maxSpeed": row["velMaxima"],
                "versors": {
                    "tangent": {
                        "x": row["versor_tangente"][0],
                        "y": row["versor_tangente"][1]
                    },
                    "normal": {
                        "x": row["versor_normal_x"],
                        "y": row["versor_normal_y"]
                    }
                }
            }
        })

    dynamics_json = {
        "coefficient_friction": friction_coefficient,
        "max_friction": max_friction,
        "avg_friction": avg_friction,
        "forces": forces_array
    }

    return dynamics_json


@app.get("/dynamics_comparison")
def dynamics_comparison(year: int, roundNumber: int, sessionNumber: int, driverNumber1: int, driverNumber2: int,
                          lapNumber: int):
    driver1_kinematics, driver2_kinematics = getKinematicVectorsWithAlignedIntrinsics(facade,driverNumber1, driverNumber2, lapNumber,
                                                                        roundNumber, sessionNumber, year)
    res = [dynamics_calcs(driver1_kinematics), dynamics_calcs(driver2_kinematics)]
    driver_numbers = [driverNumber1, driverNumber2]
    response = []

    for i, driver_res in enumerate(res):
        datos_dinamica, friction_coefficient, max_friction, avg_friction = driver_res
        forces_array = []
        for index, row in datos_dinamica.iterrows():
            forces_array.append({
                "time": timedelta_to_string(row["Time"]),
                "s": row["s"],
                "x": row["X"],
                "y": row["Y"],
                "module_velocity_xy": row["modulo_velocidad_xy"],
                "friction": {
                    "frx": row["friction_x"],
                    "fry": row["friction_y"],
                    "module": row["friction_module"],
                    "tangential": row["friction_tangential"],
                    "normal": row["friction_normal"],
                    "hasMaxSpeed": row["hasMaxSpeed"],
                    "maxSpeed": row["velMaxima"],
                    "versors": {
                        "tangent": {
                            "x": row["versor_tangente"][0],
                            "y": row["versor_tangente"][1]
                        },
                        "normal": {
                            "x": row["versor_normal_x"],
                            "y": row["versor_normal_y"]
                        }
                    }
                }
            })
        driver_response = {
            "coefficient_friction": friction_coefficient,
            "max_friction": max_friction,
            "avg_friction": avg_friction,
            "forces": forces_array
        }
        response.append({
            "driverNumber": driver_numbers[i],
            "data": driver_response
        })
    return response

@app.get("/kinematics_comparison")
def kinematics_comparison(year: int, roundNumber: int, sessionNumber: int, driverNumber1: int, driverNumber2: int,
                          lapNumber: int):
    driver1_res, driver2_res = getKinematicVectorsWithAlignedIntrinsics(facade,driverNumber1, driverNumber2, lapNumber,
                                                                        roundNumber, sessionNumber, year)

    res = [driver1_res, driver2_res]
    driver_numbers = [driverNumber1, driverNumber2]
    response = []

    for i, driver_res in enumerate(res):

        driver_response = []
        for index, row in driver_res.iterrows():
            driver_response.append(
                {
                    "time": timedelta_to_string(row["Time"]),
                    "s": row["s"],
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
                }
            )
        response.append({
            "driverNumber": driver_numbers[i],
            "data": driver_response
        })
    return response





@lru_cache(maxsize=tamano_cache)
def vector_data(year: int, roundNumber: int, sessionNumber: int, driverNumber: int, lapNumber: int):
    telemetry = facade.telemetry(year, roundNumber, sessionNumber, driverNumber, lapNumber)
    return vector_calcs(telemetry)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=3002)
