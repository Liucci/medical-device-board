from devices.update_maintenance_dates import update_maintenance_dates
from schemas.device_schemas import UpdateMaintenanceDatesRequest
from transactions.histories.create_device_history import (create_device_history)


def update_maintenance_dates_transaction(
                                            device: UpdateMaintenanceDatesRequest,
                                            hospital_id: str,
                                            user_id: str,
                                            action_type: str,
                                            message: str
                                         ):

    print("update_maintenance_dates_transaction")

    updated_device = update_maintenance_dates(
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