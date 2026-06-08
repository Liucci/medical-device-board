from common.supabase_client import supabase
from devices.finish_standby import finish_standby
from schemas.device_schemas import FinishStandbyRequest

def finish_standby_transaction(
                                 device: FinishStandbyRequest,
                                 hospital_id: str,
                                 user_id: str,
                                 action_type: str,
                                 message: str
                               ):

    print("finish_standby_transaction")

    updated_device = finish_standby(
                                      device=device,
                                      hospital_id=hospital_id
                                    )

    supabase.table("device_histories").insert({
                                                "hospital_id": hospital_id,
                                                "device_id": device.id,
                                                "action_by": user_id,
                                                "action_type": action_type,
                                                "message": message
                                              }).execute()

    return updated_device