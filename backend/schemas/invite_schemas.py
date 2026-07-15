from pydantic import BaseModel
from datetime import datetime, date

class InviteCode(BaseModel):
    id: int
    code: str
    hospital_id: str | None
    hospital_name: str | None
    email: str
    role: str
    created_by: str | None
    used: bool
    expires_at: datetime
    created_at: datetime


class CreateInviteCodeRequest(BaseModel):
    email: str
    role: str


class SendInviteMailRequest(BaseModel):
    email: str
    expires_at: str


class RegisterUserRequest(BaseModel):
    code: str
    display_name: str
    password: str

class RegisterUserResponse(BaseModel):
    email: str
    role:str
    hospital_name:str
    display_name: str

#register pageで使用
class InviteInfoResponse(BaseModel):
    email: str
    role: str

#初回登録用
class InviteFirstAdminRequest(BaseModel):
    hospital_name: str
    email: str