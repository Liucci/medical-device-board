from pydantic import BaseModel

class AddDeviceRequest(BaseModel):
    hospital_id: str
    type: int
    model: int
    asset_type: str
    status: str
    stock_area_id: int | None = None
    room_id: int | None = None
    management_number: str | None = None
    serial_number: str | None = None
    note: str | None = None
    rental_start_date: str | None = None
    rental_end_date: str | None = None
    is_under_maintenance: bool
    maintenance_started_at: str | None = None
    maintenance_finished_at: str | None = None
    standby: bool
    standby_started_at: str | None = None
    standby_finished_at: str | None = None
    created_by: str | None = None
    updated_by: str | None = None