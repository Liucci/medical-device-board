from pydantic import BaseModel

class DeviceModelsResponse(BaseModel):
    id: int
    device_type_id: int
    hospital_id: str
    name: str
    display_remaining_count: bool
    remaining_alert_count: int

class AddDeviceModelRequest(BaseModel):
    #idは自動付与
    device_type_id: int
    name: str
    display_remaining_count: bool
    remaining_alert_count: int

class DeleteDeviceModelsRequest(BaseModel):
    ids:list[int]

class UpdateDeviceModelRequest(BaseModel):
    id: int
    name: str
    display_remaining_count: bool
    remaining_alert_count: int