from pydantic import BaseModel


class DeviceTypesResponse(BaseModel):
    id: int
    hospital_id: str
    name: str #type名


class AddDeviceTypeRequest(BaseModel):
    #idはDB自動付与
    name: str #type名


class DeleteDeviceTypesRequest(BaseModel):
    #複数同時削除可能にするためlist型
    ids: list[int]


class UpdateDeviceTypeRequest(BaseModel):
    id: int
    name: str #type名