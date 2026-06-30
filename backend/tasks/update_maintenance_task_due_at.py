from common.supabase_client import supabase
from schemas.maintenance_task_schemas import UpdateMaintenanceTaskDueAtRequest


def update_maintenance_task_due_at(
    task: UpdateMaintenanceTaskDueAtRequest,
    hospital_id: str
):
    print("update_maintenance_task_due_at")

    response = (
        supabase
        .table("device_maintenance_tasks")
        .update({
            "due_at": task.due_at.isoformat()
        })
        .eq("id", task.id)
        .eq("hospital_id", hospital_id)
        .execute()
    )

    return response.data[0]