import math

import numpy as np

from f1data.F1IntrinsicsHelper import F1IntrinsicsHelper

max_radio_curva = 1500
mass_car = 950
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


def calcular_coordenadas_polares(lap_telemetry,origen_x,origen_y):

    lap_telemetry['r'] = np.sqrt(
        (lap_telemetry["X"] - origen_x) ** 2 + (lap_telemetry["Y"] - origen_y) ** 2
    )
    lap_telemetry['theta'] = np.arctan2(
        (lap_telemetry["Y"] - origen_y),
        (lap_telemetry["X"] - origen_x)
    )
    return lap_telemetry


def getKinematicVectorsWithAlignedIntrinsics(facade, driverNumber1, driverNumber2, lapNumber, roundNumber, sessionNumber, year):
    driver1_telemetry, driver2_telemetry = F1IntrinsicsHelper(facade).get_telemetry_with_aligned_intrinsics(year,
                                                                                                            roundNumber,
                                                                                                            sessionNumber,
                                                                                                            driverNumber1,
                                                                                                            driverNumber2,
                                                                                                            lapNumber)
    driver1_res = vector_calcs(driver1_telemetry)
    driver2_res = vector_calcs(driver2_telemetry)
    # Fix intrinsics after vector_calcs removes points
    max_s0 = max(driver1_res["s"][0], driver2_res["s"][0])
    driver1_res["s"] = driver1_res["s"] - max_s0
    driver2_res["s"] = driver2_res["s"] - max_s0
    return driver1_res, driver2_res



def vector_calcs(lap_telemetry):
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
    lap_telemetry['modulo_aceleracion_xy'] = np.linalg.norm(lap_telemetry[['aceleracion_x', 'aceleracion_y']],
                                                            axis=1)

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
            (lap_telemetry['r_dot'].shift(-1) - lap_telemetry['r_dot']) / lap_telemetry[
        'diferencia_tiempo']).fillna(
        0).replace([np.inf, -np.inf], 0)
    lap_telemetry['theta_double_dot'] = (
            (lap_telemetry['theta_dot'].shift(-1) - lap_telemetry['theta_dot']) / lap_telemetry[
        'diferencia_tiempo']).fillna(
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


def dynamics_calcs(datos_aceleraciones):
    maxAceleracion = datos_aceleraciones["a_normal"].max()
    # Calculando el radio para cada fila
    datos_aceleraciones["radio"] = datos_aceleraciones.apply(
        lambda row: (row["modulo_velocidad_xy"] ** 2) / row["a_normal"] if row["a_normal"] != 0 else float('inf'),
        axis=1
    )
    # Calculo si hay maxima velocidad
    datos_aceleraciones["hasMaxSpeed"] = datos_aceleraciones.apply(
        lambda row: row["radio"] <= max_radio_curva if row["radio"] != float('inf') else False,
        axis=1
    )
    # Calculando velMaxima usando maxAceleracion y el radio
    datos_aceleraciones["velMaxima"] = datos_aceleraciones.apply(
        lambda row: math.sqrt(maxAceleracion * row["radio"]) if row["radio"] != float('inf') and row[
            "hasMaxSpeed"] else 0,
        axis=1
    )
    # Cota inferior del coeficiente de rozamiento estático máximo.
    datos_aceleraciones["friction_coefficient"] = datos_aceleraciones.apply(
        lambda row: row["modulo_aceleracion_xy"] / 10 / 9.81 if row["a_normal"] != 0 else 0,
        axis=1
    )
    datos_aceleraciones["friction_x"] = (datos_aceleraciones["aceleracion_x"] * mass_car)
    datos_aceleraciones["friction_y"] = (datos_aceleraciones["aceleracion_y"] * mass_car)
    datos_aceleraciones["friction_module"] = datos_aceleraciones["modulo_aceleracion_xy"] * mass_car
    datos_aceleraciones["friction_tangential"] = datos_aceleraciones["aTangential"] * mass_car
    datos_aceleraciones["friction_normal"] = datos_aceleraciones["a_normal"] * mass_car
    friction_coefficient = datos_aceleraciones["friction_coefficient"].max()
    max_friction = datos_aceleraciones["friction_module"].max()
    avg_friction = datos_aceleraciones["friction_module"].mean()
    return datos_aceleraciones, friction_coefficient, max_friction, avg_friction
