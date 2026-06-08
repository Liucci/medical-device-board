from common.supabase_client import supabase
from devices.update_serial_number import update_serial_number
from schemas.device_schemas import UpdateSerialNumberRequest

def update_serial_number_transaction(
                                        device: UpdateSerialNumberRequest,
                                        hospital_id: str,
                                        user_id: str,
                                        action_type: str,
                                        message: str
                                     ):

    print("update_serial_number_transaction")

    updated_device = update_serial_number(
                                            device=device,
                                            hospital_id=hospital_id
                                          )

    supabase.table("device_histories").insert({
                                                "hospital_id": hospital_id,
                                                "device_id": device.id,
                                                "action_by": user_id,
                                                "action_type": action_type,
                                                "message": message,
                                                "serial_number": device.serial_number
                                              }).execute()

    return updated_device