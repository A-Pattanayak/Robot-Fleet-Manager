from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.robot_routes import router as robot_router


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(robot_router)


@app.get("/")
def root():
    return {"message": "yoo there"}
