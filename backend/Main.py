import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.robot_routes import router as robot_router


def get_allowed_origins():
    origins = os.getenv("FRONTEND_ORIGINS", "http://localhost:3000")

    return [
        origin.strip().rstrip("/")
        for origin in origins.split(",")
        if origin.strip()
    ]


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(robot_router)


@app.get("/")
def root():
    return {"message": "yoo there"}
