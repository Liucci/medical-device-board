from common.supabase_client import supabase
from devices.move_device import move_device
from schemas.device_schemas import MoveDeviceRequest
from transactions.histories.create_device_history import (create_device_history)

def move_stock_to_stock_transaction(
                                      device: MoveDeviceRequest,
                                      hospital_id: str,
                                      user_id: str,
                                      status:str,
                                      action_type: str,
                                      message: str
                                    ):

    print("move_stock_to_stock_transaction")

    moved_device = move_device(
                                device=device,
                                hospital_id=hospital_id,
                                status=status,
                                user_id=user_id
                              )

    create_device_history(
                        device_id=device.id,
                        hospital_id=hospital_id,
                        action_by=user_id,
                        action_type=action_type,
                        message=message
                     )
    return moved_device