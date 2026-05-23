from fastapi import FastAPI,Depends
from fastapi.middleware.cors import (CORSMiddleware)
from devices.fetch_devices import (fetch_devices)
from users.fetch_users import (fetch_users)
from pydantic import BaseModel
from auth.login import (login_user)
from auth.fetch_current_user import (fetch_current_user)

app = FastAPI()
#originを指定してCORSを許可する
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/login")
def login(
    body: LoginRequest
):
    response = login_user(
        email=body.email,
        password=body.password
    )
    auth_user_id = (
        response.user.id
    )
    current_user = (
        fetch_current_user(
            auth_user_id
        )
    )
    print("===== current user =====")
    print(current_user)
    return {
        "success": True,
        "access_token":
        response.session.access_token,

        "refresh_token":
        response.session.refresh_token,

        "current_user":
        current_user
    }
@app.get("/")
def root():

    return {
        "message":
        "backend running"
    }

@app.get("/users")
def get_users():
    response = fetch_users()
    print("===== users =====")

    print(response)
    return response

@app.get("/devices")
def get_devices():
    current_user = (
        fetch_current_user(
            auth_user_id= "b0c9d03a-59c3-490d-b5b3-5b7cf6fc66dc"
        )
    )
    if (
        current_user["role"]
        != "admin"
    ):
        return {
            "success": False,
            "error":
            "権限がありません"
        }
    devices = (
        fetch_devices(
            hospital_id=
            current_user[
                "hospital_id"
            ]
        )
    )

    return {
        "success": True,
        "devices":
        devices
    }