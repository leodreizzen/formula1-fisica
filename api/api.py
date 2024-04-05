import sys

import fastapi
from fastapi.middleware.cors import CORSMiddleware

from placeholders import roundsPlaceholder, driversPlaceholder, lapsPlaceholder, trajectoryPlaceholder, vectorsPlaceholder, accelerationsPlaceholder

app = fastapi.FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/rounds")
def rounds(year: int):
    #TODO implementar
    return roundsPlaceholder

@app.get("/drivers")
def drivers(year: int, roundNumber: int, sessionNumber: int):
    # TODO implementar
    return driversPlaceholder

@app.get("/laps")
def laps(year: int, roundNumber: int, sessionNumber: int, driverNumber: int):
    # TODO implementar
    return lapsPlaceholder
@app.get("/trajectory")
def trajectory(year: int, roundNumber: int, sessionNumber: int, driverNumber: int, lapNumber: int):
    # TODO implementar
    return trajectoryPlaceholder


@app.get("/vectors")
def vectors(year: int, roundNumber: int, sessionNumber: int, driverNumber: int, lapNumber: int, time: str):
    # TODO implementar
    return vectorsPlaceholder

@app.get("/accelerations")
def accelerations(year: int, roundNumber: int, sessionNumber: int, driverNumber: int, lapNumber: int):
    #TODO implementar
    return accelerationsPlaceholder

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=3002)