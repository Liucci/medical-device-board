from tasks.complete_maintenance_task import complete_maintenance_task
from schemas.maintenance_task_schemas import CompleteMaintenanceTaskRequest
from transactions.tasks.create_next_maintenance_task_transaction import create_next_maintenance_task_transaction
from transactions.histories.create_device_history import create_device_history
from schemas.device_schemas import UpdateDeviceUpdateAtRequest
from devices.update_device_updated_at import update_device_updated_at

def complete_maintenance_task_transaction(
                                            task: CompleteMaintenanceTaskRequest,
                                            hospital_id: str,
                                            user_id: str,
                                            action_type: str,
                                            message: str
                                         ):

    print("complete_maintenance_task_transaction")

    completed_task = complete_maintenance_task(
                                                 task=task,
                                                 hospital_id=hospital_id,
                                                 user_id=user_id
                                              )
    create_next_maintenance_task_transaction(
                                                device_id=completed_task["device_id"],
                                                maintenance_type_id=completed_task["maintenance_type_id"],
                                                hospital_id=hospital_id
                                             )
    update_device_updated_at(
                              device=UpdateDeviceUpdateAtRequest(id=completed_task["device_id"]),
                              hospital_id=hospital_id,
                              user_id=user_id
    )
    create_device_history(
                            device_id=completed_task["device_id"],
                            hospital_id=hospital_id,
                            action_by=user_id,
                            action_type=action_type,
                            message=message
                         )

    return completed_task