from pydantic import BaseModel

class AddMaintenanceTaskRequest(BaseModel):
    hospital_id: str
    device_id: int
    assigned_user_id: str | None = None
    maintenance_type_id: int
    scheduled_date: str | None = None
    status: str
    note: str | None = None
    created_by: str | None = None
    updated_by: str | None = None