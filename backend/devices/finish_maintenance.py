from datetime import datetime
from common.supabase_client import supabase
from schemas.device_schemas import FinishMaintenanceRequest

def finish_maintenance(
                         device: FinishMaintenanceRequest,
                         hospital_id: str
                      ):

    print("finish_maintenance")

    response = (
                  supabase
                  .table("devices")
                  .update({
                              "is_under_maintenance": False,
                              "maintenance_finished_at": datetime.utcnow().isoformat()
                          })
                  .eq("id", device.id)
                  .eq("hospital_id", hospital_id)
                  .execute()
                )

    return response.data[0]