from tasks.update_maintenance_task_due_at import update_maintenance_task_due_at
from schemas.maintenance_task_schemas import UpdateMaintenanceTaskDueAtRequest
from transactions.histories.create_device_history import create_device_history
from schemas.device_schemas import UpdateDeviceUpdateAtRequest
from devices.update_device_updated_at import update_device_updated_at

def update_maintenance_task_due_at_transaction(
                                                task: UpdateMaintenanceTaskDueAtRequest,
                                                hospital_id: str,
                                                user_id: str,
                                                action_type: str,
                                                message: str
                                            ):

    print("update_maintenance_task_due_at_transaction")

    updated_task = update_maintenance_task_due_at(
                                                    task=task,
                                                    hospital_id=hospital_id
                                                )
    update_device_updated_at(
                              device=UpdateDeviceUpdateAtRequest(id=updated_task["device_id"]),
                              hospital_id=hospital_id,
                              user_id=user_id
    )


    create_device_history(
                            device_id=updated_task["device_id"],
                            hospital_id=hospital_id,
                            action_by=user_id,
                            action_type=action_type,
                            message=message
                        )

    return updated_task