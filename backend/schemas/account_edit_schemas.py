from pydantic import BaseModel


class CreateAccountEditCodeRequest(BaseModel):
    user_id: str


class SendAccountEditMailRequest(BaseModel):
    email: str
    account_edit_url: str
    expires_at: str


class UpdateMyAccountRequest(BaseModel):
    code: str
    display_name: str
    password: str


class AccountInfoResponse(BaseModel):
    display_name: str
    email: str


class VerifyAccountEditCodeRequest(BaseModel):
    code: str