from supabase import Client
from schemas.maintenance_task_schemas import UpdateMaintenanceTaskDueAtRequest


def update_maintenance_task_due_at(
    client:Client,
    task: UpdateMaintenanceTaskDueAtRequest,
    hospital_id: str
):
    print("update_maintenance_task_due_at")

    response = (
        client
        .table("device_maintenance_tasks")
        .update({
            "due_at": task.due_at.isoformat()
        })
        .eq("id", task.id)
        .eq("hospital_id", hospital_id)
        .execute()
    )

    return response.data[0]