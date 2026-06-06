from pydantic import BaseModel


class DeviceTypesResponse(BaseModel):
    id: int
    hospital_id: str
    name: str #type名


class AddDeviceTypeRequest(BaseModel):
    #idはDB自動付与
    name: str #type名


class DeleteDeviceTypeRequest(BaseModel):
    id: int


class UpdateDeviceTypeRequest(BaseModel):
    id: int
    name: str #type名