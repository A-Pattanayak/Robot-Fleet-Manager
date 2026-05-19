import random
from datetime import datetime, timezone

from fastapi import HTTPException

from data.cities import CITY_LOCATIONS
from models.robot import RobotCreate

CRITICAL_BATTERY_MESSAGE = "Critical battery. Stop work and send robot to charging."
TELEMETRY_STEP_SECONDS = 5


def get_current_timestamp():
    return datetime.now(timezone.utc).isoformat()


def parse_timestamp(value):
    if not value:
        return None

    if isinstance(value, datetime):
        return value if value.tzinfo else value.replace(tzinfo=timezone.utc)

    if isinstance(value, str):
        try:
            normalized_value = value.replace("Z", "+00:00")
            parsed_value = datetime.fromisoformat(normalized_value)
            return parsed_value if parsed_value.tzinfo else parsed_value.replace(tzinfo=timezone.utc)
        except ValueError:
            return None

    return None


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
    current_timestamp = get_current_timestamp()

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
        "telemetryUpdatedAt": current_timestamp,
    }


def apply_robot_telemetry(robot: dict):
    next_robot = {
        **robot,
        "errorLog": list(robot.get("errorLog") or []),
    }

    last_updated_at = parse_timestamp(next_robot.get("telemetryUpdatedAt"))
    current_time = datetime.now(timezone.utc)

    if not last_updated_at:
        next_robot["telemetryUpdatedAt"] = current_time.isoformat()
        return next_robot

    elapsed_seconds = max(0, int((current_time - last_updated_at).total_seconds()))
    telemetry_steps = elapsed_seconds // TELEMETRY_STEP_SECONDS

    if telemetry_steps <= 0:
        return next_robot

    status = next_robot.get("status")
    battery = int(next_robot.get("battery", 100))

    if status == "charging":
        battery = min(100, battery + telemetry_steps)
        if battery == 100:
            status = "idle"
    elif status in ["active", "working"]:
        battery = max(0, battery - telemetry_steps)
        next_robot["uptime"] = int(next_robot.get("uptime") or 0) + telemetry_steps * 60

    errors = next_robot["errorLog"]

    if battery <= 15 and CRITICAL_BATTERY_MESSAGE not in errors:
        errors.append(CRITICAL_BATTERY_MESSAGE)

    if battery >= 30:
        errors = [error for error in errors if error != CRITICAL_BATTERY_MESSAGE]

    if status in ["active", "working"] and battery <= 10:
        status = "idle"

    next_robot.update({
        "battery": battery,
        "status": status,
        "errorLog": errors,
        "lastPing": "just now",
        "telemetryUpdatedAt": current_time.isoformat(),
    })

    return next_robot
