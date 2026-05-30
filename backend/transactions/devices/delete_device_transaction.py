from devices.delete_devices import delete_device
from tasks.delete_maintenance_tasks import delete_maintenance_tasks
from histories.add_histories import add_history
from schemas.history_schemas import ( AddHistoryRequest)

def delete_device_transaction(
                                device_id: int,
                                current_user
                              ):
    print(f"device_id: {device_id}")
    delete_maintenance_tasks(device_id=device_id)
    delete_device(device_id=device_id)
    add_history(AddHistoryRequest(
                                    hospital_id=current_user["hospital_id"],
                                    device_id=device_id,
                                    user_id=current_user["id"],
                                    action_type="delete",
                                    message="device delete"
                                ))    
    #削除したdevice_idを返す
    return device_id
