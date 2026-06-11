from common.supabase_client import supabase
from tasks.update_maintenance_task_status import update_maintenance_task_status
from schemas.maintenance_task_schemas import UpdateMaintenanceTaskStatusRequest

def update_maintenance_task_transaction(
                                          task: UpdateMaintenanceTaskStatusRequest,
                                          hospital_id: str,
                                          user_id: str,
                                          action_type: str,
                                          message: str
                                       ):

    print("update_maintenance_task_transaction")

    updated_task = update_maintenance_task_status(
                                                    task=task,
                                                    hospital_id=hospital_id
                                                  )

    supabase.table("device_histories").insert({
                                                "hospital_id": hospital_id,
                                                "device_id": updated_task["device_id"],
                                                "action_by": user_id,
                                                "action_type": action_type,
                                                "message": message
                                              }).execute()

    return updated_task