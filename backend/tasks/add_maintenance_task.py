from common.supabase_client import supabase
from schemas.maintenance_task_schemas import AddMaintenanceTaskRequest


def add_maintenance_task(
                            task: AddMaintenanceTaskRequest,
                            hospital_id: str
                        ):
    print("add_maintenance_task")
    response = (
        supabase
        .table("device_maintenance_tasks")
        .insert({
                    "hospital_id": hospital_id,
                    "device_id": task.device_id,
                    "maintenance_type_id": task.maintenance_type_id,
                    "due_at": task.due_at.isoformat()
                })
        .execute()
    )

    return response.data[0]