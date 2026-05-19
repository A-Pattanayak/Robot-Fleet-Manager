import random

from fastapi import HTTPException

from data.cities import CITY_LOCATIONS
from models.robot import RobotCreate

def get_city(city_id: str):
    city = CITY_LOCATIONS.get(city_id)

    if not city:
        raise HTTPException(status_code=400, detail="Invalid city")

    return city


def simulate_location(city: dict):
    offset_range = city["range"]

    return {
        "lat": round(city["lat"] + random.uniform(-offset_range, offset_range), 6),
        "lng": round(city["lng"] + random.uniform(-offset_range, offset_range), 6),
        "label": city["label"],
    }


def build_robot(robot: RobotCreate):
    city = get_city(robot.cityId)

    return {
        "id": robot.id,
        "name": robot.name,
        "task": robot.task,
        "cityId": robot.cityId,
        "city": city["label"],
        "status": random.choice(["idle", "active", "working"]),
        "battery": random.randint(40, 100),
        "uptime": random.randint(0, 7200),
        "location": simulate_location(city),
        "errorLog": [],
        "lastPing": "just now",
    }
