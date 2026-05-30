# delete_maintenance_task.py

from common.supabase_client import (
    supabase
)


def delete_maintenance_tasks(device_id: int):
    print("delete_maintenance_task")
    response = (
        supabase
        .table(
            "device_maintenance_tasks"
        )
        .delete()
        .eq(
            "id",
            device_id
        )
        .execute()
    )
    return response

