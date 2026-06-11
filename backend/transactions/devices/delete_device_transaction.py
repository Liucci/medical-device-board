from common.supabase_client import supabase
from devices.delete_device import delete_device
from tasks.delete_tasks_by_device_id import delete_tasks_by_device_id
from schemas.device_schemas import DeleteDeviceRequest

def delete_device_transaction(
                                device: DeleteDeviceRequest,
                                hospital_id: str,
                                user_id: str,
                                action_type: str,
                                message: str
                              ):

    print("delete_device_transaction")

    supabase.table("device_histories").insert({
                                                "hospital_id": hospital_id,
                                                "device_id": device.id,
                                                "action_by": user_id,
                                                "action_type": action_type,
                                                "message": message
                                              }).execute()

    delete_tasks_by_device_id(
                                          device_id=device.id,
                                          hospital_id=hospital_id
                                  )
    delete_device(
                    device=device,
                    hospital_id=hospital_id
                 )