from common.supabase_admin_client import supabase
from devices.update_management_number import update_management_number
from schemas.device_schemas import UpdateManagementNumberRequest
from transactions.histories.create_device_history import (create_device_history)

def update_management_number_transaction(
                                            device: UpdateManagementNumberRequest,
                                            hospital_id: str,
                                            user_id: str,
                                            action_type: str,
                                            message: str
                                         ):

    print("update_management_number_transaction")

    updated_device = update_management_number(
                                                device=device,
                                                hospital_id=hospital_id
                                              )

    create_device_history(
                        device_id=device.id,
                        hospital_id=hospital_id,
                        action_by=user_id,
                        action_type=action_type,
                        message=message
                     )
    return updated_device