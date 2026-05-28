from pydantic import BaseModel

class AddMaintenanceLogRequest(BaseModel):
    hospital_id: str
    device_id:int
    task_id: int
    maintenance_type_id: int
    note: str | None = None