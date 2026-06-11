from datetime import datetime
from common.supabase_client import supabase
from schemas.maintenance_task_schemas import UpdateMaintenanceTaskStatusRequest

def update_maintenance_task_status(
                                     task: UpdateMaintenanceTaskStatusRequest,
                                     hospital_id: str
                                  ):

    update_data = {
                    "status": task.status
                  }

    if task.status == "completed":
        update_data["completed_at"] = datetime.utcnow().isoformat()

    response = (
        supabase
        .table("device_maintenance_tasks")
        .update(update_data)
        .eq("id", task.id)
        .eq("hospital_id", hospital_id)
        .execute()
    )

    return response.data[0]