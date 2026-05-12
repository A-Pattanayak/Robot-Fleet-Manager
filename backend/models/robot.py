from typing import Literal

from pydantic import BaseModel


CityId = Literal[
    "delhi",
    "mumbai",
    "pune",
    "hyderabad",
    "bangalore",
    "kolkata",
    "chennai",
]

RobotStatus = Literal["active", "working", "idle", "charging", "error"]


class StatusUpdate(BaseModel):
    status: RobotStatus


class RobotCreate(BaseModel):
    id: str
    name: str
    task: str
    cityId: CityId
