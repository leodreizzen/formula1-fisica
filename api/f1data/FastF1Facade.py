from .F1Facade import F1Facade
from .Round import Round
from .Session import Session
from .Driver import Driver


import fastf1 as f1

class FastF1Facade(F1Facade):
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
        session_event = f1.get_session(year, roundNumber, sessionNumber)
        session_event.load()
        driversNumber = session_event.drivers
        drivers = []
        for driverNumber in driversNumber:
            driverInfo = session_event.get_driver(driverNumber)
            driverToReturn = Driver(driverInfo.DriverNumber, driverInfo.FullName, driverInfo.CountryCode, driverInfo.TeamName, driverInfo.TeamColor)
            drivers.append(driverToReturn)
        
        return drivers

    def lapCount(self,year: int, roundNumber: int, sessionNumber: int, driverNumber: int) -> int:
        session_event = f1.get_session(year, roundNumber, sessionNumber)
        session_event.load()
        laps = session_event.laps.pick_driver(str(driverNumber))
        return len(laps)

    def fastestLap(self,year: int, roundNumber: int, sessionNumber: int, driverNumber: int) -> int:
        session_event = f1.get_session(year, roundNumber, sessionNumber)
        session_event.load()
        fatest_lap = session_event.laps.pick_driver(str(driverNumber)).pick_fastest()
        return int(fatest_lap.LapNumber)

    def telemetry(self,year: int, roundNumber: int, sessionNumber: int, driverId: int, lapNumber: int):
        session_event = f1.get_session(year, roundNumber, sessionNumber)
        session_event.load()
        lap_telemetry = session_event.laps.pick_driver(str(driverId)).pick_lap(lapNumber).telemetry
        return lap_telemetry[["X", "Y", "Z", "Time", "Speed", "nGear"]].reset_index()
    
   