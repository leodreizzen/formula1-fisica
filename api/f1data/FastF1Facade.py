import F1Facade
import Round, Driver
class FastF1Facade(F1Facade):
    def rounds(self, year: int) -> list[Round]:
        #TODO IMPLEMENTAR
        raise NotImplementedError("Method not implemented")
    def drivers(self, year: int, roundNumber:int, sessionNumber: int) -> list[Driver]:
        # TODO IMPLEMENTAR
        raise NotImplementedError("Method not implemented")

    def lapCount(year:int, roundNumber:int, sessionNumber: int, driverNumber: int) -> int:
        # TODO IMPLEMENTAR
        raise NotImplementedError("Method not implemented")

    def fastestLap(year:int, roundNumber:int, sessionNumber: int, driverNumber: int) -> int:
        # TODO IMPLEMENTAR
        raise NotImplementedError("Method not implemented")

    def telemetry(year:int, roundNumber:int, sessionNumber: int, driverId: int, lapNumber: int):
        # TODO IMPLEMENTAR
        raise NotImplementedError("Method not implemented")
