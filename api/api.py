import fastapi
from fastapi.middleware.cors import CORSMiddleware


from f1data.FastF1Facade import FastF1Facade as FastF1Facade
from placeholders import driversPlaceholder, lapsPlaceholder, trajectoryPlaceholder, vectorsPlaceholder, \
    accelerationsPlaceholder

app = fastapi.FastAPI()
facade = FastF1Facade()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/rounds")
def rounds(year: int = None):
   return facade.rounds(year)

@app.get("/drivers")
def drivers(year: int, roundNumber: int, sessionNumber: int):
    return facade.drivers(year, roundNumber, sessionNumber)


@app.get("/laps")
def laps(year: int, roundNumber: int, sessionNumber: int, driverNumber: int):
    laps=[]
    laps.append({
        "lapCount": facade.lapCount(year, roundNumber, sessionNumber, driverNumber),
        "fastestLap": facade.fastestLap(year, roundNumber, sessionNumber, driverNumber),
    })
    return laps
    


@app.get("/trajectory")
def trajectory(year: int, roundNumber: int, sessionNumber: int, driverNumber: int, lapNumber: int):
    return facade.telemetry(year, roundNumber, sessionNumber, driverNumber, lapNumber)


@app.get("/vectors")
def vectors(year: int, roundNumber: int, sessionNumber: int, driverNumber: int, lapNumber: int, time: str):
    # TODO implementar
    return vectorsPlaceholder


@app.get("/accelerations")
def accelerations(year: int, roundNumber: int, sessionNumber: int, driverNumber: int, lapNumber: int):
    # TODO implementar
    return accelerationsPlaceholder


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=3002)
