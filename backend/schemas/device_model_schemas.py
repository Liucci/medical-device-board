from pydantic import BaseModel

class AddDeviceModelRequest(BaseModel):
    hospital_id: str
    device_type_id: int
    name: str
