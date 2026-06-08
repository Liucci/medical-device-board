from datetime import datetime
from pydantic import BaseModel


class MaintenanceTaskResponse(BaseModel):
    id: int
    hospital_id: str
    device_id: int
    maintenance_type_id: int
    due_at: datetime
    completed_at: datetime | None = None
    completed_by: str | None = None
    created_at: datetime


class AddMaintenanceTaskRequest(BaseModel):
    device_id: int
    maintenance_type_id: int
    due_at: datetime


class CompleteMaintenanceTaskRequest(BaseModel):
    id: int


class DeleteMaintenanceTasksRequest(BaseModel):
    ids: list[int]

