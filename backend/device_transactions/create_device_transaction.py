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
    device_response = add_device(device)

    if not device_response["success"]:

        print("device insert failed")

        return {
                "success": False
                }

    inserted_device = device_response["device"]

    print("inserted_device")

    for key, value in inserted_device.items():
        print(f"・{key}: {value}")

    # histories insert
    history = AddHistoryRequest(
        hospital_id=
            device.hospital_id,

        device_id=
            inserted_device["id"],

        user_id=
            device.created_by,

        action=
            "create",

        note=
            (
                "新規登録"
            )
    )

    history_response = add_history(history)

    if not history_response["success"]:

        print("history insert failed")

        return {
                "success": False
                }

    return {
            "success": True,
            "device": inserted_device,
            "history": history_response["history"]
            }