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