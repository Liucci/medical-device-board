from common.supabase_client import supabase
from schemas.maintenance_task_schemas import DeleteMaintenanceTasksRequest


def delete_maintenance_tasks(
                                task: DeleteMaintenanceTasksRequest,
                                device_id: int,
                                hospital_id: str
                            ):

    response = (
        supabase
        .table("device_maintenance_tasks")
        .delete()
        .in_(
                "id",
                task.ids
            )
        .eq(
            "device_id",
            device_id
            )
        .eq(
                "hospital_id",
                hospital_id
            )
        .execute()
    )

    return response.data