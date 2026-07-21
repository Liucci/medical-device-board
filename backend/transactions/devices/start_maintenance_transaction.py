from common.supabase_admin_client import supabase
from devices.start_maintenance import start_maintenance
from schemas.device_schemas import StartMaintenanceRequest
from transactions.histories.create_device_history import (create_device_history)

def start_maintenance_transaction(
                                    device: StartMaintenanceRequest,
                                    hospital_id: str,
                                    user_id: str,
                                    action_type: str,
                                    message: str
                                  ):

    print("start_maintenance_transaction")

    updated_device = start_maintenance(
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