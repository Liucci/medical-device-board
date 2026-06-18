from datetime import datetime
from common.supabase_client import supabase
from schemas.maintenance_task_schemas import CompleteMaintenanceTaskRequest

def complete_maintenance_task(
                                task: CompleteMaintenanceTaskRequest,
                                hospital_id: str,
                                user_id: str
                             ):
    print("complete_maintenance_task")
    response = (
                  supabase
                  .table("device_maintenance_tasks")
                  .update({
                              "completed_at": datetime.utcnow().isoformat(),
                              "completed_by": user_id
                           })
                  .eq("id", task.id)
                  .eq("hospital_id", hospital_id)
                  .execute()
               )

    return response.data[0]