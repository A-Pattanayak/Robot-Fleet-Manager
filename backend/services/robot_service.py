from fastapi import HTTPException

from core.firebase import db
from models.robot import RobotCreate, StatusUpdate
from services.simulation_service import apply_robot_telemetry, build_robot, get_current_timestamp


def robots_collection(uid: str):
    return db.collection("users").document(uid).collection("robots")


def get_robots_for_user(uid: str):
    robot_docs = robots_collection(uid).stream()
    robots = []

    for robot_doc in robot_docs:
        robot = apply_robot_telemetry(robot_doc.to_dict())
        robot_doc.reference.set(robot, merge=True)
        robots.append(robot)

    return robots


def get_robot_for_user(uid: str, robot_id: str):
    robot_ref = robots_collection(uid).document(robot_id)
    robot_snapshot = robot_ref.get()

    if not robot_snapshot.exists:
        raise HTTPException(status_code=404, detail="Robot not found")

    robot = apply_robot_telemetry(robot_snapshot.to_dict())
    robot_ref.set(robot, merge=True)

    return robot


def create_robot_for_user(uid: str, robot: RobotCreate):
    robot_ref = robots_collection(uid).document(robot.id)

    if robot_ref.get().exists:
        raise HTTPException(status_code=400, detail="Robot with this ID already exists")

    new_robot = build_robot(robot)
    robot_ref.set(new_robot)
    return new_robot


def update_robot_status_for_user(uid: str, robot_id: str, status_update: StatusUpdate):
    robot_ref = robots_collection(uid).document(robot_id)
    robot_snapshot = robot_ref.get()

    if not robot_snapshot.exists:
        raise HTTPException(status_code=404, detail="Robot not found")

    robot = apply_robot_telemetry(robot_snapshot.to_dict())

    if robot.get("battery", 100) <= 15 and status_update.status in ["active", "working"]:
        raise HTTPException(
            status_code=400,
            detail="Battery is critically low. Stop the robot or move it to charging.",
        )

    robot_ref.set(
        {
            **robot,
            "status": status_update.status,
            "telemetryUpdatedAt": get_current_timestamp(),
        },
        merge=True,
    )
    return robot_ref.get().to_dict()


def delete_robot_for_user(uid: str, robot_id: str):
    robot_ref = robots_collection(uid).document(robot_id)
    robot_snapshot = robot_ref.get()

    if not robot_snapshot.exists:
        raise HTTPException(status_code=404, detail="Robot not found")

    deleted_robot = robot_snapshot.to_dict()
    robot_ref.delete()

    return {
        "message": "Robot deleted successfully",
        "robot": deleted_robot,
    }
