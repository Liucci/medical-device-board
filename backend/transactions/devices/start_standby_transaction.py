from common.supabase_client import supabase
from devices.start_standby import start_standby
from schemas.device_schemas import StartStandbyRequest
from transactions.histories.create_device_history import (create_device_history)

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

    create_device_history(
                        device_id=device.id,
                        hospital_id=hospital_id,
                        action_by=user_id,
                        action_type=action_type,
                        message=message
                     )
    return updated_device