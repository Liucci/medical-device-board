from pydantic import BaseModel


class AccountEditCodeResponse(BaseModel):
    id: int
    user_id: str
    code: str
    used: bool
    expires_at: str
    created_at: str


class CreateAccountEditCodeRequest(BaseModel):
    user_id: str


class VerifyAccountEditCodeRequest(BaseModel):
    user_id: str
    code: str


class UpdateMyAccountRequest(BaseModel):
    user_id: str
    display_name: str
    password: str | None = None

class SendAccountEditMailRequest(BaseModel):
    email: str
    account_edit_url: str
    expires_at: str