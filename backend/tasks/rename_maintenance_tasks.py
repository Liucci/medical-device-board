# rename_maintenance_task.py

from common.supabase_client import (
    supabase
)


def rename_maintenance_task(
    task_id: int,
    status: str
):
    try:

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

    except Exception as e:

        print(
            f"rename_maintenance_task "
            f"error: {e}"
        )

        return None
