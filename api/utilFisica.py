import numpy as np
import json
def calcular_vector_velocidad(elemento_final: [], elemento_inicial: []):
    if elemento_inicial["index"] == elemento_final["index"]:
        vector_speed = np.array([np.float64(0), np.float64(0), np.float64(0)])
    else:
        vector_posicion_final = np.array([elemento_final["X"], elemento_final["Y"], elemento_final["Z"]])
        vector_posicion_inicial = np.array([elemento_inicial["X"], elemento_inicial["Y"], elemento_inicial["Z"]])
        position_delta = vector_posicion_final - vector_posicion_inicial
        time_delta = (elemento_final["Time"] - elemento_inicial["Time"]).total_seconds()
        vector_speed = np.divide(position_delta, time_delta)
    return vector_speed



def calcular_vector_aceleracion(vector_velocidad_final: [], vector_velocidad_inicial: [], time_delta: float):

    if np.array_equal(vector_velocidad_final, vector_velocidad_inicial) or time_delta == 0.0:
        vector_aceleracion = np.array([np.float64(0), np.float64(0), np.float64(0)])
    else:
        delta_velocidad = vector_velocidad_final - vector_velocidad_inicial
        vector_aceleracion = np.divide(delta_velocidad, time_delta)

    return vector_aceleracion
