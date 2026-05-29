# delete_maintenance_task.py

from common.supabase_client import (
    supabase
)


def delete_maintenance_task(task_id: int):
    print("delete_maintenance_task")
    response = (
        supabase
        .table(
            "device_maintenance_tasks"
        )
        .delete()
        .eq(
            "id",
            task_id
        )
        .execute()
    )
    return response.data[0]

