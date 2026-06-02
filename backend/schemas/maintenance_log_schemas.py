from pydantic import BaseModel


class MaintenanceLogResponse(BaseModel):
    id: int
    hospital_id: str
    device_id: int
    maintenance_type_id: int
    maintenance_type_name: str
    performed_at: str
    performed_by: str | None = None
    note: str | None = None
    device_type_name: str | None = None
    device_model_name: str | None = None
    management_number: str | None = None
    serial_number: str | None = None
