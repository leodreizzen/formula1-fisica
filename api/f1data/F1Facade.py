from abc import ABC, abstractmethod
from .Round import Round
from .Driver import Driver


class F1Facade(ABC):
    @abstractmethod
    def rounds(self, year: int) -> list[Round]:
        raise NotImplementedError("Method not implemented")

    @abstractmethod
    def drivers(self, year: int, roundNumber: int, sessionNumber: int) -> list[Driver]:
        raise NotImplementedError("Method not implemented")

    @abstractmethod
    def lapCount(self,year: int, roundNumber: int, sessionNumber: int, driverNumber: int) -> int:
        raise NotImplementedError("Method not implemented")

    @abstractmethod
    def fastestLap(self,year: int, roundNumber: int, sessionNumber: int, driverNumber: int) -> int:
        raise NotImplementedError("Method not implemented")

    @abstractmethod
    def telemetry(self,year: int, roundNumber: int, sessionNumber: int, driverId: int, lapNumber: int, interpolated=True):
        raise NotImplementedError("Method not implemented")
