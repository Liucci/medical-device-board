from datetime import datetime
from common.supabase_client import supabase
from schemas.device_schemas import StartStandbyRequest

def start_standby(
                    device: StartStandbyRequest,
                    hospital_id: str
                 ):

    print("start_standby")

    response = (
                  supabase
                  .table("devices")
                  .update({
                              "standby": True,
                              "standby_started_at": datetime.utcnow().isoformat(),
                              "standby_finished_at": None
                          })
                  .eq("id", device.id)
                  .eq("hospital_id", hospital_id)
                  .execute()
                )

    return response.data[0]