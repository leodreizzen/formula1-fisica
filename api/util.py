import pandas as pd


def timedelta_to_string(delta):
    # Obtener los componentes del timedelta
    days = delta.days
    seconds = delta.seconds
    microseconds = delta.microseconds

    # Calcular los componentes de la fecha y hora
    years = days // 365
    days %= 365
    months = days // 30
    days %= 30
    hours = seconds // 3600
    seconds %= 3600
    minutes = seconds // 60
    seconds %= 60

    # Formatear los segundos con los decimales correctos
    seconds_with_microseconds = seconds + microseconds / 1e6

    # Formatear la salida
    formatted_timedelta = "{:04}-{:02}-{:02}T{:02}:{:02}:{:06.3f}".format(
        years, months, days, hours, minutes, seconds_with_microseconds)

    return formatted_timedelta


def timestamp_to_string(timestamp):
    dt_object = pd.to_datetime(timestamp, unit='ms')

    formatted_timestamp = dt_object.strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3]

    return formatted_timestamp


def calcular_vector_velocidad(elemento_final: [], elemento_inicial: []):
    vector_speed_x = (elemento_final["X"] - elemento_inicial["X"]) / (elemento_final["Time"] - elemento_inicial["Time"]).total_seconds()
    vector_speed_y = (elemento_final["Y"] - elemento_inicial["Y"]) / (elemento_final["Time"] - elemento_inicial["Time"]).total_seconds()
    vector_speed_z = (elemento_final["Z"] - elemento_inicial["Z"]) / (elemento_final["Time"] - elemento_inicial["Time"]).total_seconds()

    module = (vector_speed_x ** 2 + vector_speed_y ** 2 + vector_speed_z ** 2) ** 0.5

    velocimeter = elemento_final["Speed"]

    return [
        {
            "vX": vector_speed_x,
            "vY": vector_speed_y,
            "vZ": vector_speed_z,
            "module": module,
            "speedometer": velocimeter
        }
    ]

def string_to_timedelta(formatted_timedelta):
    # Dividir la cadena formateada en sus componentes
    components = formatted_timedelta.split('T')
    date_part = components[0]
    time_part = components[1]

    # Obtener los componentes de fecha y hora
    year, month, day = map(int, date_part.split('-'))
    time_components = list(map(float, time_part.split(':')))
    hour, minute, second_with_microseconds = time_components

    # Dividir los segundos y microsegundos
    second = int(second_with_microseconds)
    microsecond = int((second_with_microseconds - second) * 1e6)

    # Calcular los días totales
    total_days = year * 365 + month * 30 + day

    # Calcular los segundos totales
    total_seconds = hour * 3600 + minute * 60 + second

    # Crear el objeto Timedelta de Pandas
    delta = pd.Timedelta(days=total_days, seconds=total_seconds, microseconds=microsecond)

    return delta
