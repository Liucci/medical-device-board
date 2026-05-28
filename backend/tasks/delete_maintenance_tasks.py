# delete_maintenance_task.py

from common.supabase_client import (
    supabase
)


def delete_maintenance_task(
    task_id: int
):
    try:

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

    except Exception as e:

        print(
            f"delete_maintenance_task "
            f"error: {e}"
        )

        return None