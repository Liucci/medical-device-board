from common.supabase_client import supabase
from devices.finish_maintenance import finish_maintenance
from schemas.device_schemas import FinishMaintenanceRequest
from transactions.histories.create_device_history import (create_device_history)

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

    create_device_history(
                        device_id=device.id,
                        hospital_id=hospital_id,
                        action_by=user_id,
                        action_type=action_type,
                        message=message
                     )
    return updated_device