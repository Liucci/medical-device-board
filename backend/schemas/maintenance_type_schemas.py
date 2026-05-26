from pydantic import BaseModel

class AddMaintenanceTypeRequest(BaseModel):
    hospital_id: str
    device_type_id: int
    name: str
    interval_days: int | None = None
    created_by: str | None = None
    updated_by: str | None = None