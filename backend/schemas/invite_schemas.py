from pydantic import BaseModel

class CreateInviteCodeRequest(BaseModel):
    email: str
    role: str