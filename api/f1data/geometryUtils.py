import math

import numpy as np


def vectorPointProjection(x1, x2, y1, y2, x, y):
    # Calculate the projection of a point (x, y) over the line defined by the points (x1, y1) and (x2, y2)
    # Draw a line that is perpendicular to the line defined by the points (x1, y1) and (x2, y2) and that passes through the point (x, y)

    # (x1 + t(x2 - x1) - x3)(x2 - x1) + (y1 + t(y2 - y1) - y3)(y2 - y1) = 0

    numerador = (-x1 * x2 + x1 ** 2 + x2 * x - x1 * x - y1 * y2 + y1 ** 2 + y2 * y - y1 * y)
    denominador = (x2 ** 2 - 2 * x1 * x2 + x1 ** 2 + y2 ** 2 - 2 * y1 * y2 + y1 ** 2)

    t = numerador / denominador
    proyeccion = np.array([x1 + t * (x2 - x1), y1 + t * (y2 - y1)])
    return t, proyeccion


def nearest_point(x_values, y_values, x, y):
    dx = x_values - x
    dy = y_values - y
    distancia = np.sqrt(dx ** 2 + dy ** 2)

    return np.argmin(distancia)
