from common.supabase_client import (
    supabase
)

from schemas.maintenance_task_schemas import (
    AddMaintenanceTaskRequest
)

def add_task(
             task: AddMaintenanceTaskRequest
             ):

    print("insert task")

    for key, value in task.dict().items():
        print(f"・{key}: {value}")

    response = (
        supabase
        .table("device_maintenance_tasks")
        .insert({
            "hospital_id":
                task.hospital_id,

            "device_id":
                task.device_id,

            "assigned_user_id":
                task.assigned_user_id,

            "maintenance_type_id":
                task.maintenance_type_id,

            "scheduled_date":
                task.scheduled_date,

            "status":
                task.status,

            "note":
                task.note,

            "created_by":
                task.created_by,

            "updated_by":
                task.updated_by
        })
        .execute()
    )

    print("insert response")

    for row in response.data:
        print(f"・{row}")

    return {
            "success": True,
            "task": response.data[0]
            }