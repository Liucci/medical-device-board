from devices.add_devices import (
    add_device
)

from histories.add_histories import (
    add_history
)

from schemas.device_schemas import (
    AddDeviceRequest
)

from schemas.history_schemas import (
    AddHistoryRequest
)

def create_device_transaction(
                              device: AddDeviceRequest,
                              ):

    print("create_device_transaction")

    # 新規登録時はCE室固定
    device.status = "stock"
    device.stock_area_id = 1
    device.room_id = None

    # devices insert
    #devices tableに追加
    device_response = add_device(device)


    history = AddHistoryRequest(
                        hospital_id=device.hospital_id,
                        device_id=device_response["id"],
                        user_id=device.created_by,
                        action_type="create",
                        stock_area_id=1,
                        stock_area_name="CE室",
                        message="新規登録"
                    )
    #device_histories tableに追加
    history_response = add_history(history)

    #returnすることで、frontに情報を渡す
    return {
        "create_device_transaction success"
        "device": device_response,
        "history": history_response
    }