from datetime import datetime,timezone
from common.supabase_admin_client import supabase
from schemas.device_schemas import FinishMaintenanceRequest

def finish_maintenance(
                         device: FinishMaintenanceRequest,
                         hospital_id: str,
                         user_id:str
                      ):

    print("finish_maintenance")

    response = (
                  supabase
                  .table("devices")
                  .update({
                              "is_under_maintenance": False,
                              "maintenance_finished_at": datetime.utcnow().isoformat(),
                              "updated_by": user_id,
                              "updated_at": datetime.now(timezone.utc).isoformat()
                          })
                  .eq("id", device.id)
                  .eq("hospital_id", hospital_id)
                  .execute()
                )

    return response.data[0]

#使用していない不要かも
def clear_maintenance(
                         device: FinishMaintenanceRequest,
                         hospital_id: str,
                         user_id:str
                     ):

    print("clear_maintenance")

    response = (
                  supabase
                  .table("devices")
                  .update({
                              "is_under_maintenance": False,
                              "maintenance_started_at": None,
                              "maintenance_finished_at": None,
                              "updated_by": user_id,
                              "updated_at": datetime.now(timezone.utc).isoformat()
                          })
                  .eq("id", device.id)
                  .eq("hospital_id", hospital_id)
                  .execute()
                )

    return response.data[0]