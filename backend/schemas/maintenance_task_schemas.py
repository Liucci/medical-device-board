from pydantic import BaseModel


class AddMaintenanceTaskRequest(
    BaseModel
):

    hospital_id: str

    device_id: int

    maintenance_type_id: int

    due_at: str

    status: str
