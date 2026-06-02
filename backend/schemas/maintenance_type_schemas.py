from pydantic import BaseModel

class MaintenanceTypeResponse(BaseModel):
    id: int
    hospital_id: str
    name: str
    device_type_id: int
    device_model_id: int | None = None
    interval_days: int

class AddMaintenanceTypeRequest(BaseModel):
    name: str
    device_type_id: int
    device_model_id: int | None = None
    interval_days: int

class DeleteMaintenanceTypesRequest(BaseModel):
    ids: list[int]

class UpdateMaintenanceTypeRequest(BaseModel):
    id: int
    name: str
    interval_days: int

