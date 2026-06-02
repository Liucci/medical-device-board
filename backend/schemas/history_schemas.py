from pydantic import BaseModel
class HistoryResponse(BaseModel):
    id: int
    device_id: int
    device_type_name: str | None = None
    device_model_name: str | None = None
    action_type: str
    status: str
    room_name: str | None = None
    stock_area_name: str | None = None
    patient_name: str | None = None
    message: str
    maintenance_started_at: str | None = None
    maintenance_finished_at: str | None = None
    created_at: str
