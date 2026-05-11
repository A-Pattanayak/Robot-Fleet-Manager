from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Literal


app = FastAPI()

class StatusUpdate(BaseModel):
    status: Literal["active", "working", "idle", "error"]

class Location(BaseModel):
    lat: float
    lng: float
    label: str


class RobotCreate(BaseModel):
    id: str
    name: str
    status: Literal["active", "working", "idle", "error"]
    battery: int
    task: str
    uptime: int
    location: Location
    errorLog: list[str]
    lastPing: str


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

mock_robots = [
    {
        "id": "RBT-001",
        "name": "Rishabh-01",
        "status": "idle",
        "battery": 19,
        "task": "Patrolling Zone A",
        "uptime": 7200,
        "location": {
            "lat": 28.6139,
            "lng": 77.2090,
            "label": "Warehouse Delhi-A",
        },
        "errorLog": [],
        "lastPing": "2 mins ago",
    }
]


@app.get("/")
def root():
    return {"message": "yoo there"}


@app.get("/api/robots")
def get_robots():
    return mock_robots


@app.get("/api/robots/{robot_id}")
def get_robot(robot_id: str):
    for robot in mock_robots:
        if robot["id"] == robot_id:
            return robot

    raise HTTPException(status_code=404, detail="Robot not found")


@app.patch("/api/robots/{robot_id}")
def update_robot_status(robot_id: str, status_update: StatusUpdate):
    for robot in mock_robots:
        if robot["id"] == robot_id:
            robot["status"] = status_update.status
            return robot

    raise HTTPException(status_code=404, detail="Robot not found")

@app.post("/api/robots")
def create_robot(robot: RobotCreate):
    for existing_robot in mock_robots:
        if existing_robot["id"] == robot.id:
            raise HTTPException(
                status_code=400,
                detail="Robot with this ID already exists"
            )

    new_robot = robot.model_dump()
    mock_robots.append(new_robot)

    return new_robot

@app.delete("/api/robots/{robot_id}")
def delete_robot(robot_id: str):

    for index, robot in enumerate(mock_robots):

        if robot["id"] == robot_id:

            deleted_robot = mock_robots.pop(index)

            return {
                "message": "Robot deleted successfully",
                "robot": deleted_robot
            }

    raise HTTPException(
        status_code=404,
        detail="Robot not found"
    )
