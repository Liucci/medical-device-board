from pydantic import BaseModel

class AddHistoryRequest(BaseModel):
    hospital_id: str
    device_id: int
    user_id: str
    action: str
    note: str | None = None