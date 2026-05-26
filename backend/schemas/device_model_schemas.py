from pydantic import BaseModel

class AddDeviceModelRequest(BaseModel):
    hospital_id: str
    device_type_id: int
    name: str
    manufacturer: str | None = None
    created_by: str | None = None
    updated_by: str | None = None