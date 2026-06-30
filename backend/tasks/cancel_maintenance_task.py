from common.supabase_client import supabase
from schemas.maintenance_task_schemas import CancelMaintenanceTaskRequest


def cancel_maintenance_task(
    task: CancelMaintenanceTaskRequest,
    hospital_id: str
):
    print("cancel_maintenance_task")

    response = (
        supabase
        .table("device_maintenance_tasks")
        .update({
            "is_active": task.is_active
        })
        .eq("id", task.id)
        .eq("hospital_id", hospital_id)
        .execute()
    )

    return response.data[0]