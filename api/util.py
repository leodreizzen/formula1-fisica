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

