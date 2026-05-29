# rename_maintenance_task.py

from common.supabase_client import (
    supabase
)


def rename_maintenance_task(
    task_id: int,
    status: str
):
    print("rename_maintenance_task")
    response = (
        supabase
        .table(
            "device_maintenance_tasks"
        )
        .update({
            "status":
                status
        })
        .eq(
            "id",
            task_id
        )
        .execute()
    )
    return response.data[0]

