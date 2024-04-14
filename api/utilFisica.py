import numpy as np
import json
def calcular_vector_velocidad(punto: [], punto_anterior: []):
    if punto_anterior["index"] == punto["index"]:
        vector_speed = np.array([np.float64(0), np.float64(0), np.float64(0)])
    else:
        vector_punto = np.array([punto["X"], punto["Y"], punto["Z"]])
        vector_punto_anterior = np.array([punto_anterior["X"], punto_anterior["Y"], punto_anterior["Z"]])
        position_delta = vector_punto - vector_punto_anterior
        time_delta = (punto["Time"] - punto_anterior["Time"]).total_seconds()
        vector_speed = np.divide(position_delta, time_delta)
    return vector_speed



def calcular_vector_aceleracion(vector_velocidad_final: [], vector_velocidad_inicial: [], time_delta: float):

    if np.array_equal(vector_velocidad_final, vector_velocidad_inicial) or time_delta == 0.0:
        vector_aceleracion = np.array([np.float64(0), np.float64(0), np.float64(0)])
    else:
        delta_velocidad = vector_velocidad_final - vector_velocidad_inicial
        vector_aceleracion = np.divide(delta_velocidad, time_delta)

    return vector_aceleracion
