from datetime import datetime
from common.supabase_client import supabase
from schemas.maintenance_task_schemas import CompleteMaintenanceTaskRequest


def complete_maintenance_task(
                                task: CompleteMaintenanceTaskRequest,
                                completed_by: str,
                                hospital_id: str
                             ):

    response = (
        supabase
        .table("device_maintenance_tasks")
        .update({
                    "completed_at": datetime.utcnow().isoformat(),
                    "completed_by": completed_by
                })
        .eq(
                "id",
                task.id
            )
        .eq(
                "hospital_id",
                hospital_id
            )
        .execute()
    )

    return response.data[0]