import numpy as np
import pandas as pd

from .F1Facade import F1Facade
from .geometryUtils import vectorPointProjection, nearest_point
from .utilData import telemetry_interpolation, filter_telemetry, calculate_intrinsic_s


class F1IntrinsicsHelper:
    def __init__(self, facade: F1Facade):
        self.f1_facade = facade

    def get_telemetry_with_aligned_intrinsics(self, year, round_number, session_number, driver_number1, driver_number2,
                                              lap_number):
        driver_1_data = self.f1_facade.telemetry(year, round_number, session_number, driver_number1, lap_number, False)
        driver_2_data = self.f1_facade.telemetry(year, round_number, session_number, driver_number2, lap_number, False)

        # Obtener vector que va entre el primer y segundo punto del primer conductor
        # Trazar perpendicular entre el vector y el primer punto de driver2. Ver si la intersección está en el mismo sentido o al revés

        t = vectorPointProjection(driver_1_data["X"][0],
                                  driver_1_data["X"][10],
                                  driver_1_data["Y"][0],
                                  driver_1_data["Y"][10],
                                  driver_2_data["X"][0],
                                  driver_2_data["Y"][0]
                                  )[0]

        # Si t >= 0, el 1º conductor empezó más atrás que el 2º
        if t >= 0:
            first_driver = driver_1_data
            second_driver = driver_2_data
        else:
            first_driver = driver_2_data
            second_driver = driver_1_data

        first_driver_full_data, second_driver_full_data = self.__align_intrinsics(first_driver, second_driver)

        if t >= 0:
            driver_1_full_data = first_driver_full_data
            driver_2_full_data = second_driver_full_data
        else:
            driver_1_full_data = second_driver_full_data
            driver_2_full_data = first_driver_full_data

        return driver_1_full_data, driver_2_full_data

    def __align_intrinsics(self, first_driver, second_driver):
        # Split the first driver data in two parts. Consider the first point of the second driver as the reference point for intrinsic coordinates calculations
        left_side_filtered, right_side_filtered = self.__split_and_filter_to_align(first_driver, second_driver)

        # Both sides share the center point, so we can remove the first point of the right side
        right_side_filtered = right_side_filtered.iloc[1:]

        s_izq = -np.flip(calculate_intrinsic_s(left_side_filtered.iloc[::-1]))
        s_der = calculate_intrinsic_s(right_side_filtered)

        first_driver_full_data = pd.concat([left_side_filtered, right_side_filtered], ignore_index=True)
        first_driver_full_data["s"] = np.concatenate([s_izq, s_der])

        second_driver_full_data = filter_telemetry(telemetry_interpolation(second_driver))
        second_driver_full_data["s"] = calculate_intrinsic_s(second_driver_full_data)
        return first_driver_full_data, second_driver_full_data

    def __split_and_filter_to_align(self, driver_data_to_split, reference_driver_data):
        index, left_side, right_side = self.__split_to_align(driver_data_to_split, reference_driver_data)
        right_side_interp = telemetry_interpolation(right_side).iloc[1:]
        right_side_interp.reset_index(drop=True, inplace=True)
        left_side_interp = telemetry_interpolation(left_side, keep_last_point=True)
        result = pd.concat([left_side_interp, right_side_interp], ignore_index=True)
        result = filter_telemetry(result)
        parte_izq_filtrada = result.head(index + 1)
        parte_der_filtrada = result.iloc[index + 1:]
        return parte_izq_filtrada, parte_der_filtrada

    def __split_to_align(self, driver_data_to_split, reference_driver_data):
        # Get the nearest point to the first point of the reference driver, and break the driver data in two parts.
        index = self.__find_index_to_split(driver_data_to_split, reference_driver_data)

        # The point can be before or after the first point of the reference driver
        t, projection = vectorPointProjection(driver_data_to_split["X"][index], driver_data_to_split["X"][index + 1],
                                              driver_data_to_split["Y"][index], driver_data_to_split["Y"][index + 1],
                                              reference_driver_data["X"][0],
                                              reference_driver_data["Y"][0])
        if t < 0 and index > 0:
            index -= 1
            t, projection = vectorPointProjection(driver_data_to_split["X"][index],
                                                  driver_data_to_split["X"][index + 1],
                                                  driver_data_to_split["Y"][index],
                                                  driver_data_to_split["Y"][index + 1],
                                                  reference_driver_data["X"][0], reference_driver_data["Y"][0])
        left_side = driver_data_to_split.head(index + 1)
        right_side = driver_data_to_split.iloc[index + 1:]
        center = self.__get_center_point_dataframe(driver_data_to_split, index, left_side, projection)
        left_side = pd.concat([left_side, center], copy=True, ignore_index=True)
        right_side = pd.concat([center, right_side], copy=True, ignore_index=True)
        return index, left_side, right_side

    def __get_center_point_dataframe(self, driver_data_to_split, index, left_side, projection):
        dx_total = driver_data_to_split["X"][index + 1] - driver_data_to_split["X"][index]
        dy_total = driver_data_to_split["Y"][index + 1] - driver_data_to_split["Y"][index]
        dtotal = np.sqrt(dx_total ** 2 + dy_total ** 2)
        dx_proyection = projection[0] - driver_data_to_split["X"][index]
        dy_proyection = projection[1] - driver_data_to_split["Y"][index]
        dproyection = np.sqrt(dx_proyection ** 2 + dy_proyection ** 2)
        center = pd.DataFrame(
            {
                "X": projection[0],
                "Y": projection[1],
                "Z": np.interp(dproyection, [0, dtotal],
                               [driver_data_to_split["Z"][index], driver_data_to_split["Z"][index + 1]]),
                "nGear": left_side["nGear"][0],
                "Speed": np.interp(dproyection, [0, dtotal],
                                   [driver_data_to_split["Speed"][index], driver_data_to_split["Speed"][index + 1]]),

                "Time": pd.Timedelta(seconds=np.interp(dproyection, [0, dtotal],
                                                       [driver_data_to_split["Time"][index].total_seconds(),
                                                        driver_data_to_split["Time"][index + 1].total_seconds()])),
            }, index=[0])
        return center

    def __find_index_to_split(self, driver_data_to_split, reference_driver_data):
        n_values_to_search = int(len(driver_data_to_split) * 0.8)  # Prevent selecting the last points
        x_values_to_search = reference_driver_data["X"].head(n_values_to_search)
        y_values_to_search = reference_driver_data["Y"].head(n_values_to_search)
        index = nearest_point(x_values_to_search, y_values_to_search, reference_driver_data["X"][0],
                              reference_driver_data["Y"][0])
        return index
