from pydantic import BaseModel
from datetime import datetime, date

class AccountEditCodeSchema(BaseModel):
    id: int
    user_id: str
    code: str
    used: bool
    expires_at: datetime
    created_at: datetime


#RequestはbackのAPIをたたくための変数と型の定義
#frontから受けるJSONと同じ変数にする必要がある
class CreateAccountEditCodeRequest(BaseModel):
    user_id: str
    email:str


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