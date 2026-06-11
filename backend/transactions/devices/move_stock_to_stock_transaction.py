from common.supabase_client import supabase
from devices.move_device import move_device
from schemas.device_schemas import MoveDeviceRequest

def move_stock_to_stock_transaction(
                                      device: MoveDeviceRequest,
                                      hospital_id: str,
                                      user_id: str,
                                      action_type: str,
                                      message: str
                                    ):

    print("move_stock_to_stock_transaction")

    moved_device = move_device(
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

    return moved_device