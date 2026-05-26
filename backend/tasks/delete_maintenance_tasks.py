from common.supabase_client import (
    supabase
)

def delete_maintenance_task(
                            task_id: int
                            ):

    print(f"delete task_id: {task_id}")

    response = (
        supabase
        .table("device_maintenance_tasks")
        .delete()
        .eq(
            "id",
            task_id
        )
        .execute()
    )

    print("delete response")

    for row in response.data:
        print(f"・{row}")

    return {
            "success": True,
            "task": response.data[0]
            }