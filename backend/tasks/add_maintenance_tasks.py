# add_maintenance_task.py

from common.supabase_client import (
    supabase
)

from schemas.maintenance_task_schemas import (
    AddMaintenanceTaskRequest
)


def add_maintenance_task(task: AddMaintenanceTaskRequest):
    print("add_maintenance_task")
    response = (
            supabase
            .table(
                "device_maintenance_tasks"
            )
            .insert({
                "hospital_id":
                    task.hospital_id,

                "device_id":
                    task.device_id,

                "maintenance_type_id":
                    task.maintenance_type_id,

                "due_at":
                    task.due_at,

                "status":
                    task.status,

            })
            .execute()
        )
    return response.data[0]


