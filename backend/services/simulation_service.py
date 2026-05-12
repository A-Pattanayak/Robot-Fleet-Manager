import random

from fastapi import HTTPException

from data.cities import CITY_LOCATIONS, MOVEMENT_STEP_RANGE
from models.robot import RobotCreate

CRITICAL_BATTERY_MESSAGE = "Critical battery. Stop work and send robot to charging."


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


def clamp(value: float, minimum: float, maximum: float):
    return max(minimum, min(value, maximum))


def simulate_next_location(city: dict, current_location: dict):
    city_range = city["range"]
    min_lat = city["lat"] - city_range
    max_lat = city["lat"] + city_range
    min_lng = city["lng"] - city_range
    max_lng = city["lng"] + city_range

    current_lat = current_location.get("lat", city["lat"])
    current_lng = current_location.get("lng", city["lng"])

    return {
        "lat": round(
            clamp(
                current_lat + random.uniform(-MOVEMENT_STEP_RANGE, MOVEMENT_STEP_RANGE),
                min_lat,
                max_lat,
            ),
            6,
        ),
        "lng": round(
            clamp(
                current_lng + random.uniform(-MOVEMENT_STEP_RANGE, MOVEMENT_STEP_RANGE),
                min_lng,
                max_lng,
            ),
            6,
        ),
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


def simulate_robot_telemetry(robot: dict):
    status = robot.get("status", "idle")
    battery = robot.get("battery", 100)
    errors = robot.get("errorLog", [])

    if status == "charging":
        battery = min(100, battery + random.randint(1, 3))
        if battery == 100:
            status = "idle"
    elif status in ["active", "working"]:
        battery = max(0, battery - random.randint(1, 5))
        robot["uptime"] = robot.get("uptime", 0) + random.randint(60, 240)

        if robot.get("cityId"):
            city = get_city(robot["cityId"])
            robot["location"] = simulate_next_location(city, robot.get("location", {}))

    if battery <= 15 and CRITICAL_BATTERY_MESSAGE not in errors:
        errors.append(CRITICAL_BATTERY_MESSAGE)

    if battery >= 30:
        errors = [error for error in errors if error != CRITICAL_BATTERY_MESSAGE]

    if status in ["active", "working"] and battery <= 10:
        status = "idle"

    robot["battery"] = battery
    robot["status"] = status
    robot["errorLog"] = errors
    robot["lastPing"] = random.choice(["just now", "1 min ago", "2 mins ago"])

    return robot
