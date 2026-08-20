from datetime import datetime,timezone
from supabase import Client
from schemas.device_schemas import FinishMaintenanceRequest

def finish_maintenance(
                        client:Client,
                        device: FinishMaintenanceRequest,
                        hospital_id: str,
                        user_id:str
                      ):

    print("finish_maintenance")

    response = (
                  client
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

