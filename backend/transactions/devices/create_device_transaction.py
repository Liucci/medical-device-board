
from devices.add_devices import (add_device)
from histories.add_histories import (add_history)
from schemas.device_schemas import (AddDeviceRequest)
from schemas.history_schemas import (AddHistoryRequest)

def create_device_transaction(
                                device: AddDeviceRequest,
                                current_user
                              ):
    print("create_device_transaction")
    device_response = add_device(AddDeviceRequest(
                                                hospital_id=current_user["hospital_id"],
                                                type=device.type,
                                                model=device.model,
                                                asset_type=device.asset_type,
                                                status="stock",
                                                stock_area_id=1,
                                                room_id=None,
                                                rental_start_date=device.rental_start_date,
                                                rental_end_date=device.rental_end_date,
                                                created_by=current_user["id"],
                                                ))
    add_history(AddHistoryRequest(
                                    hospital_id=current_user["hospital_id"],
                                    device_id=device_response["id"],
                                    user_id=current_user["id"],
                                    action_type="create",
                                    stock_area_id=1,
                                    stock_area_name="CE室",
                                    message="新規登録"
                                ))

    return device_response

