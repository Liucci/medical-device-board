from datetime import datetime, timezone
from common.supabase_admin_client import supabase
from schemas.device_schemas import StartStandbyRequest

def start_standby(
                    device: StartStandbyRequest,
                    hospital_id: str,
                    user_id:str
                 ):

    print("start_standby")

    response = (
                  supabase
                  .table("devices")
                  .update({
                              "standby": True,
                              "standby_started_at": datetime.utcnow().isoformat(),
                              "standby_finished_at": None,
                              "updated_by": user_id,
                              "updated_at": datetime.now(timezone.utc).isoformat()
                          })
                  .eq("id", device.id)
                  .eq("hospital_id", hospital_id)
                  .execute()
                )

    return response.data[0]