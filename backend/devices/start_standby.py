from datetime import datetime, timezone
from supabase import Client
from schemas.device_schemas import StartStandbyRequest

def start_standby(
                    client:Client,
                    device: StartStandbyRequest,
                    hospital_id: str,
                    user_id:str
                 ):

    print("start_standby")

    response = (
                  client
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