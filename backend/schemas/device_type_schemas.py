from pydantic import BaseModel


class DeviceTypesResponse(BaseModel):
    id: int
    hospital_id: str
    name: str #type名
    icon_color: str


class AddDeviceTypeRequest(BaseModel):
    #idはDB自動付与
    name: str #type名
    icon_color: str


class DeleteDeviceTypeRequest(BaseModel):
    id: int

# 部分更新できるようにする
class UpdateDeviceTypeRequest(BaseModel):
    id: int
    name: str | None = None
    icon_color: str | None = None