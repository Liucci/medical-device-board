from common.supabase_client import supabase
from devices.start_standby import start_standby
from schemas.device_schemas import StartStandbyRequest

def start_standby_transaction(
                                device: StartStandbyRequest,
                                hospital_id: str,
                                user_id: str,
                                action_type: str,
                                message: str
                              ):

    print("start_standby_transaction")

    updated_device = start_standby(
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