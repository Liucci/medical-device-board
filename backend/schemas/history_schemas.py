from pydantic import BaseModel


class AddHistoryRequest(BaseModel):

    hospital_id: str

    device_id: int

    user_id: str

    action_type: str

    message: str

    status: str | None = None

    stock_area_id: int | None = None

    room_id: int | None = None

    management_number: str | None = None

    serial_number: str | None = None

    note: str | None = None

    error_code: str | None = None

    error_level: str | None = None

    error_detail: str | None = None

    created_at: str | None = None

    patient_name: str | None = None

    device_type_name: str | None = None

    device_model_name: str | None = None

    room_name: str | None = None

    stock_area_name: str | None = None

    maintenance_started_at: str | None = None

    maintenance_finished_at: str | None = None

    standby_started_at: str | None = None

    standby_finished_at: str | None = None

    action_by: str | None = None