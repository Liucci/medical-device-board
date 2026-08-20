from datetime import datetime, timezone
from supabase import Client
from schemas.device_schemas import FinishStandbyRequest

def finish_standby(
                    client:Client,
                    device: FinishStandbyRequest,
                    hospital_id: str,
                    user_id:str
                  ):

    print("finish_standby")

    response = (
                  client
                  .table("devices")
                  .update({
                              "standby": False,
                              "standby_finished_at": datetime.utcnow().isoformat(),
                              "updated_by": user_id,
                              "updated_at": datetime.now(timezone.utc).isoformat()
                          })
                  .eq("id", device.id)
                  .eq("hospital_id", hospital_id)
                  .execute()
                )

    return response.data[0]


def clear_standby(
                      client:Client,
                      device: FinishStandbyRequest,
                      hospital_id: str,
                      user_id:str
                  ):
    response = (
                client
                .table("devices")
                .update({
                        "standby": False,
                        "standby_started_at": None,
                        "standby_finished_at": None,
                        "updated_by": user_id,
                        "updated_at": datetime.now(timezone.utc).isoformat()
                  })
                  .eq("id", device.id)
                  .eq("hospital_id", hospital_id)
                  .execute()
                )
    
    return response.data[0]