from tasks.cancel_maintenance_task import cancel_maintenance_task
from schemas.maintenance_task_schemas import CancelMaintenanceTaskRequest
from transactions.histories.create_device_history import create_device_history


def cancel_maintenance_task_transaction(
                                        task: CancelMaintenanceTaskRequest,
                                        hospital_id: str,
                                        user_id: str,
                                        action_type: str,
                                        message: str
                                    ):

    print("cancel_maintenance_task_transaction")

    cancelled_task = cancel_maintenance_task(
                                                task=task,
                                                hospital_id=hospital_id
                                            )

    create_device_history(
                            device_id=cancelled_task["device_id"],
                            hospital_id=hospital_id,
                            action_by=user_id,
                            action_type=action_type,
                            message=message
                        )

    return cancelled_task