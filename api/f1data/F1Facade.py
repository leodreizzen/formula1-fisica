from abc import ABC, abstractmethod
import Driver, Round
class F1Facade(ABC):
    @abstractmethod
    def rounds(self, year: int) -> list[Round]:
        raise NotImplementedError("Method not implemented")
    @abstractmethod
    def drivers(self, year: int, roundNumber:int, sessionNumber: int) -> list[Driver]:
        raise NotImplementedError("Method not implemented")

    @abstractmethod
    def lapCount(year:int, roundNumber:int, sessionNumber: int, driverNumber: int) -> int:
        raise NotImplementedError("Method not implemented")

    @abstractmethod
    def fastestLap(year:int, roundNumber:int, sessionNumber: int, driverNumber: int) -> int:
        raise NotImplementedError("Method not implemented")

    @abstractmethod
    def telemetry(year:int, roundNumber:int, sessionNumber: int, driverId: int, lapNumber: int):
        raise NotImplementedError("Method not implemented")
