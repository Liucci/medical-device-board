from common.supabase_admin_client import supabase
from supabase import Client
from devices.update_serial_number import update_serial_number
from schemas.device_schemas import UpdateSerialNumberRequest
from transactions.histories.create_device_history import (create_device_history)

def update_serial_number_transaction(
                                        client:Client,
                                        device: UpdateSerialNumberRequest,
                                        hospital_id: str,
                                        user_id: str,
                                        action_type: str,
                                        message: str
                                     ):

    print("update_serial_number_transaction")

    updated_device = update_serial_number(
                                            client=client,
                                            device=device,
                                            hospital_id=hospital_id,
                                            user_id=user_id
                                          )

    create_device_history(
                        device_id=device.id,
                        hospital_id=hospital_id,
                        action_by=user_id,
                        action_type=action_type,
                        message=message
                     )
    return updated_device