from datetime import datetime
from common.supabase_client import supabase
from schemas.device_schemas import FinishStandbyRequest

def finish_standby(
                     device: FinishStandbyRequest,
                     hospital_id: str
                  ):

    print("finish_standby")

    response = (
                  supabase
                  .table("devices")
                  .update({
                              "standby": False,
                              "standby_finished_at": datetime.utcnow().isoformat()
                          })
                  .eq("id", device.id)
                  .eq("hospital_id", hospital_id)
                  .execute()
                )

    return response.data[0]


def clear_standby(
                      device: FinishStandbyRequest,
                      hospital_id: str
                  ):
    response = (
                supabase
                .table("devices")
                .update({
                        "standby": False,
                        "standby_started_at": None,
                        "standby_finished_at": None
                  })
                  .eq("id", device.id)
                  .eq("hospital_id", hospital_id)
                  .execute()
                )
    
    return response.data[0]