from pydantic import BaseModel

class AddRoomRequest(BaseModel):
    hospital_id: str
    ward_id: int
    name: str
    patient_name: str | None = None
    created_by: str | None = None
    updated_by: str | None = None