from pydantic import BaseModel
from datetime import datetime


class HistoryResponse(BaseModel):
    id: int
    hospital_id: str
    device_id: int
    action_by: str

    action_type: str
    message: str | None = None

    room_id: int | None = None
    stock_area_id: int | None = None

    management_number: str | None = None
    serial_number: str | None = None
    note: str | None = None
    patient_name: str | None = None

    device_type_name: str | None = None
    device_model_name: str | None = None
    room_name: str | None = None
    stock_area_name: str | None = None

    maintenance_started_at: datetime | None = None
    maintenance_finished_at: datetime | None = None

    standby_started_at: datetime | None = None
    standby_finished_at: datetime | None = None

    created_at: datetime


class AddHistoryRequest(BaseModel):
    action_type: str
    device_id: int