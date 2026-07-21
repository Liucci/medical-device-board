from datetime import datetime, timezone
from common.supabase_admin_client import supabase
from schemas.device_schemas import StartMaintenanceRequest

def start_maintenance(
                        device: StartMaintenanceRequest,
                        hospital_id: str,
                        user_id:str
                     ):

    print("start_maintenance")

    response = (
                  supabase
                  .table("devices")
                  .update({
                              "is_under_maintenance": True,
                              "maintenance_started_at": datetime.utcnow().isoformat(),
                              "maintenance_finished_at": None,
                              "updated_by": user_id,
                              "updated_at": datetime.now(timezone.utc).isoformat()
                          })
                  .eq("id", device.id)
                  .eq("hospital_id", hospital_id)
                  .execute()
                )

    return response.data[0]