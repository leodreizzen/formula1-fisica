from .Session import Session

class Round:
    def __init__(self, roundNumber: int, country: str, location: str, eventName: str, sessions: list[Session]):
        self.roundNumber = roundNumber
        self.country = country
        self.location = location
        self.eventName = eventName
        self.sessions = sessions