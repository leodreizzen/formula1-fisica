import numpy as np
import pandas as pd
from scipy.signal import savgol_filter


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