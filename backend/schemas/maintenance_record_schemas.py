from pydantic import BaseModel

class AddMaintenanceRecordRequest(BaseModel):
    hospital_id: str
    task_id: int
    completed_by: str
    result: str
    note: str | None = None