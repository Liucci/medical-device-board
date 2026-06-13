from transactions.histories.create_device_history import create_device_history
from devices.delete_device import delete_device
from tasks.delete_tasks_by_device_id import delete_tasks_by_device_id
from schemas.device_schemas import DeleteDeviceRequest

def delete_device_transaction(
                                device: DeleteDeviceRequest,
                                hospital_id: str,
                                user_id: str,
                                action_type: str,
                                message: str
                             ):

    print("delete_device_transaction")

    create_device_history(
                            device_id=device.id,
                            hospital_id=hospital_id,
                            action_by=user_id,
                            action_type=action_type,
                            message=message
                         )

    delete_tasks_by_device_id(
                                device_id=device.id,
                                hospital_id=hospital_id
                             )

    delete_device(
                    device=device,
                    hospital_id=hospital_id
                 )