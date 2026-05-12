from fastapi.middleware.cors import CORSMiddleware
from fastapi import Depends, FastAPI, Header, HTTPException
import os
import firebase_admin
from firebase_admin import auth as firebase_auth
from firebase_admin import credentials, firestore
from pydantic import BaseModel
from typing import Literal


app = FastAPI()


def initialize_firebase_admin():
    if firebase_admin._apps:
        return

    service_account_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

    if service_account_path:
        cred = credentials.Certificate(service_account_path)
        firebase_admin.initialize_app(cred)
        return

    firebase_admin.initialize_app(credentials.ApplicationDefault())


initialize_firebase_admin()
db = firestore.client()

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


def get_current_user_uid(authorization: str = Header(None)) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing Firebase ID token")

    token = authorization.split("Bearer ", 1)[1]

    try:
        decoded_token = firebase_auth.verify_id_token(token)
        return decoded_token["uid"]
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid Firebase ID token")


def robots_collection(uid: str):
    return db.collection("users").document(uid).collection("robots")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "yoo there"}


@app.get("/api/robots")
def get_robots(uid: str = Depends(get_current_user_uid)):
    robot_docs = robots_collection(uid).stream()
    return [robot_doc.to_dict() for robot_doc in robot_docs]


@app.get("/api/robots/{robot_id}")
def get_robot(robot_id: str, uid: str = Depends(get_current_user_uid)):
    robot_snapshot = robots_collection(uid).document(robot_id).get()

    if robot_snapshot.exists:
        return robot_snapshot.to_dict()

    raise HTTPException(status_code=404, detail="Robot not found")


@app.patch("/api/robots/{robot_id}")
def update_robot_status(
    robot_id: str,
    status_update: StatusUpdate,
    uid: str = Depends(get_current_user_uid),
):
    robot_ref = robots_collection(uid).document(robot_id)
    robot_snapshot = robot_ref.get()

    if robot_snapshot.exists:
        robot_ref.update({"status": status_update.status})
        updated_robot = robot_ref.get().to_dict()
        return updated_robot

    raise HTTPException(status_code=404, detail="Robot not found")


@app.post("/api/robots")
def create_robot(robot: RobotCreate, uid: str = Depends(get_current_user_uid)):
    robot_ref = robots_collection(uid).document(robot.id)

    if robot_ref.get().exists:
        raise HTTPException(
            status_code=400,
            detail="Robot with this ID already exists"
        )

    new_robot = robot.model_dump()
    robot_ref.set(new_robot)
    return new_robot


@app.delete("/api/robots/{robot_id}")
def delete_robot(robot_id: str, uid: str = Depends(get_current_user_uid)):
    robot_ref = robots_collection(uid).document(robot_id)
    robot_snapshot = robot_ref.get()

    if robot_snapshot.exists:
        deleted_robot = robot_snapshot.to_dict()
        robot_ref.delete()
        return {
            "message": "Robot deleted successfully",
            "robot": deleted_robot
        }

    raise HTTPException(
        status_code=404,
        detail="Robot not found"
    )
