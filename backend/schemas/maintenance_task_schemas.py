
from pydantic import BaseModel


class MaintenanceTaskResponse(BaseModel):
    id: int
    hospital_id: str
    device_id: int
    maintenance_type_id: int
    maintenance_type_name: str
    interval_days:int  | None = None
    warning_days:int  | None = None


class CompleteMaintenanceTaskRequest(BaseModel):
    id: int



