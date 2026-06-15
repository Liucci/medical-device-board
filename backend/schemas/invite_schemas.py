from pydantic import BaseModel

class CreateInviteCodeRequest(BaseModel):
    email: str
    role: str


class SendInviteMailRequest(BaseModel):
    email: str
    invite_url: str