from .F1Facade import F1Facade
from .Round import Round
from .Session import Session
from .Driver import Driver
import fastf1 as f1
from functools import lru_cache
from .utilData import telemetry_interpolation, filter_telemetry

""" 
#Tamaño de la cache en memoria de cada funcion de la api 
#El tamaño esta dado por la cantidad de llamadas con sus parametros que se pueden guardar
#Por ejemplo si se quieren guardar 4 llamadas en la cache se debe poner el tamaño en 4
"""

tamano_cache = 2

class FastF1Facade(F1Facade):
    @lru_cache(maxsize=tamano_cache)
    def __get_session(self, year: int, roundNumber: int, sessionNumber: int) -> f1.core.Session:
        session = f1.get_session(year, roundNumber, sessionNumber)
        session.load()
        return session

    def rounds(self, year: int) -> list[Round]:
        roundsSchedule = f1.get_event_schedule(year, include_testing=False)
        rounds = []
        for row in roundsSchedule.itertuples():
            roundNumber = row.RoundNumber
            country = row.Country
            eventName = row.EventName
            location = row.Location

            session1 = Session(1, row.Session1, row.Session1DateUtc)
            session2 = Session(2, row.Session2, row.Session2DateUtc)
            session3 = Session(3, row.Session3, row.Session3DateUtc)
            session4 = Session(4, row.Session4, row.Session4DateUtc)
            session5 = Session(5, row.Session5, row.Session5DateUtc)

            RoundSessions = [session1, session2, session3, session4, session5]
            round = Round(roundNumber, country, location, eventName, RoundSessions)
            rounds.append(round)

        return rounds

    def drivers(self, year: int, roundNumber: int, sessionNumber: int) -> list[Driver]:
        session_event = self.__get_session(year, roundNumber, sessionNumber)
        driversNumber = session_event.drivers
        drivers = []
        for driverNumber in driversNumber:
            driverInfo = session_event.get_driver(driverNumber)
            driverToReturn = Driver(driverInfo.DriverNumber, driverInfo.FullName, driverInfo.CountryCode,
                                    driverInfo.TeamName, driverInfo.TeamColor)
            drivers.append(driverToReturn)

        return drivers

    def lapCount(self, year: int, roundNumber: int, sessionNumber: int, driverNumber: int) -> int:
        session_event = self.__get_session(year, roundNumber, sessionNumber)
        laps = session_event.laps.pick_driver(str(driverNumber))
        return len(laps)

    def fastestLap(self, year: int, roundNumber: int, sessionNumber: int, driverNumber: int) -> int:
        session_event = self.__get_session(year, roundNumber, sessionNumber)
        fatest_lap = session_event.laps.pick_driver(str(driverNumber)).pick_fastest()
        return int(fatest_lap.LapNumber)

    @lru_cache(maxsize=tamano_cache)
    def telemetry(self, year: int, roundNumber: int, sessionNumber: int, driverId: int, lapNumber: int, interpolated=True):
        session_event = self.__get_session(year, roundNumber, sessionNumber)
        lap_telemetry = session_event.laps.pick_driver(str(driverId)).pick_lap(lapNumber).telemetry
        lap_telemetry = lap_telemetry[["X", "Y", "Z", "Time", "Speed", "nGear"]]
        lap_telemetry.reset_index(inplace=True)
        if interpolated:
            lap_telemetry = telemetry_interpolation(lap_telemetry)
            return filter_telemetry(lap_telemetry)
        else:
            return lap_telemetry
    
   