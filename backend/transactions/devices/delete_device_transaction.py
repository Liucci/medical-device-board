from common.supabase_client import supabase
from devices.delete_devices import delete_device
from tasks.delete_maintenance_tasks import delete_maintenance_tasks
from schemas.device_schemas import DeleteDeviceRequest

def delete_device_transaction(
                                device: DeleteDeviceRequest,
                                hospital_id: str,
                                user_id: str
                              ):

    print("delete_device_transaction")

    delete_maintenance_tasks(device_id=device.id)

    delete_device(
                    device=device,
                    hospital_id=hospital_id
                 )

    supabase.table("device_histories").insert({
                                                "hospital_id": hospital_id,
                                                "device_id": device.id,
                                                "user_id": user_id,
                                                "action_type": "delete",
                                                "message": "device delete"
                                              }).execute()
