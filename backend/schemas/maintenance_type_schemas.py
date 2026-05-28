from pydantic import BaseModel


class AddMaintenanceTypeRequest(
    BaseModel
):

    hospital_id: str

    name: str

    device_type_id: int

    device_model_id:int | None = None

    interval_days: int

    warning_days:int | None = None

    auto_create_on_drop:bool | None = None

    is_active:bool | None = None