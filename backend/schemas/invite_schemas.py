from pydantic import BaseModel

class CreateInviteCodeRequest(BaseModel):
    email: str
    role: str


class SendInviteMailRequest(BaseModel):
    email: str
    invite_url: str


class RegisterUserRequest(BaseModel):
    code: str
    password: str
    display_name: str

class RegisterUserResponse(BaseModel):
    display_name:str
    role:str
    hospital_name:str