from fastapi import APIRouter, Depends

from models.robot import RobotCreate, StatusUpdate
from services.auth_service import get_current_user_uid
from services.robot_service import (
    create_robot_for_user,
    delete_robot_for_user,
    get_robot_for_user,
    get_robots_for_user,
    update_robot_status_for_user,
)


router = APIRouter(prefix="/api/robots", tags=["robots"])


@router.get("")
def get_robots(uid: str = Depends(get_current_user_uid)):
    return get_robots_for_user(uid)


@router.get("/{robot_id}")
def get_robot(robot_id: str, uid: str = Depends(get_current_user_uid)):
    return get_robot_for_user(uid, robot_id)


@router.post("")
def create_robot(robot: RobotCreate, uid: str = Depends(get_current_user_uid)):
    return create_robot_for_user(uid, robot)


@router.patch("/{robot_id}")
def update_robot_status(
    robot_id: str,
    status_update: StatusUpdate,
    uid: str = Depends(get_current_user_uid),
):
    return update_robot_status_for_user(uid, robot_id, status_update)


@router.delete("/{robot_id}")
def delete_robot(robot_id: str, uid: str = Depends(get_current_user_uid)):
    return delete_robot_for_user(uid, robot_id)
