import numpy as np
import pandas as pd
from scipy.signal import savgol_filter

from utilFisica import calcular_coordenadas_polares


def telemetry_interpolation(lap_telemetry, keep_last_point=False):
    time_interval = 100  # ms
    times = lap_telemetry['Time'].apply(lambda x: x.total_seconds())
    pointCount = int((times.iloc[-1] - times.iloc[0]) * 1000 / time_interval)
    time_interval_array = []
    if not keep_last_point:
        time_interval_array = np.linspace(times.iloc[0],
                                          times.iloc[-1],
                                          pointCount)
    else:
        time_interval_array = np.flip(np.linspace(times.iloc[-1],
                                          times.iloc[0],
                                          pointCount))
    time_interval_array = pd.to_timedelta(time_interval_array, unit='s')

    lap_telemetry_time = lap_telemetry['Time']
    lap_telemetry_x = lap_telemetry['X']
    lap_telemetry_y = lap_telemetry['Y']
    lap_telemetry_z = lap_telemetry['Z']
    lap_telemetry_x_interpolated = np.interp(time_interval_array, lap_telemetry_time, lap_telemetry_x)
    lap_telemetry_y_interpolated = np.interp(time_interval_array, lap_telemetry_time, lap_telemetry_y)
    lap_telemetry_z_interpolated = np.interp(time_interval_array, lap_telemetry_time, lap_telemetry_z)
    lap_telemetry_speed = lap_telemetry['Speed']
    lap_telemetry_speed_interpolated = np.interp(time_interval_array, lap_telemetry_time, lap_telemetry_speed)
    lap_telemetry_interpolated = pd.DataFrame({
        'Time': pd.to_timedelta(time_interval_array, unit='s'),
        'X': lap_telemetry_x_interpolated,
        'Y': lap_telemetry_y_interpolated,
        'Z': lap_telemetry_z_interpolated,
        'Speed': lap_telemetry_speed_interpolated
    })
    return lap_telemetry_interpolated


def filter_telemetry(lap_telemetry):
    window_length_pos = 90
    polyorder_pos = 3
    x = savgol_filter(lap_telemetry["X"], window_length=window_length_pos, polyorder=polyorder_pos, mode="nearest")
    y = savgol_filter(lap_telemetry["Y"], window_length=window_length_pos, polyorder=polyorder_pos, mode="nearest")
    z = savgol_filter(lap_telemetry["Z"], window_length=window_length_pos, polyorder=polyorder_pos, mode="nearest")
    return lap_telemetry.assign(
        X=x,
        Y=y,
        Z=z)

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

def calculate_intrinsic_s(lap_telemetry):
    modules = np.sqrt(lap_telemetry["X"].diff() ** 2 + lap_telemetry["Y"].diff() ** 2).fillna(0)
    return np.cumsum(modules)