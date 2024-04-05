import Session

class Round:
    def __init__(self, roundNumber: int, country: str, eventName: str, sessions: list[Session]):
        self.roundNumber = roundNumber
        self.country = country
        self.eventName = eventName
        self.sessions = sessions