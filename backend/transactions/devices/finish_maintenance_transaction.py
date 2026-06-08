from common.supabase_client import supabase
from devices.finish_maintenance import finish_maintenance
from schemas.device_schemas import FinishMaintenanceRequest

def finish_maintenance_transaction(
                                     device: FinishMaintenanceRequest,
                                     hospital_id: str,
                                     user_id: str,
                                     action_type: str,
                                     message: str
                                   ):

    print("finish_maintenance_transaction")

    updated_device = finish_maintenance(
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