from common.supabase_client import (
    supabase
)

def rename_maintenance_task(
                            task_id: int,
                            assigned_user_id: str | None = None,
                            maintenance_type_id: int | None = None,
                            scheduled_date: str | None = None,
                            status: str | None = None,
                            note: str | None = None
                            ):

    print(f"rename task_id: {task_id}")
    print(f"assigned_user_id: {assigned_user_id}")
    print(f"maintenance_type_id: {maintenance_type_id}")
    print(f"scheduled_date: {scheduled_date}")
    print(f"status: {status}")
    print(f"note: {note}")

    response = (
        supabase
        .table("device_maintenance_tasks")
        .update({
            "assigned_user_id":
                assigned_user_id,

            "maintenance_type_id":
                maintenance_type_id,

            "scheduled_date":
                scheduled_date,

            "status":
                status,

            "note":
                note
        })
        .eq(
            "id",
            task_id
        )
        .execute()
    )

    print("rename response")

    for row in response.data:
        print(f"・{row}")

    return {
            "success": True,
            "task": response.data[0]
            }