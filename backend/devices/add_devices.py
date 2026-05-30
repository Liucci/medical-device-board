from common.supabase_client import (supabase)
from schemas.device_schemas import (AddDeviceRequest)

def add_device(
                device: AddDeviceRequest,
              ):

    print("add_device")
    # for key, value in device.model_dump().items():
    #     print(f"・{key}: {value}")

    response = (
        supabase
        .table("devices")
        .insert(device.model_dump())
        .execute()
    )
    #insertしたdeviceのidを出力
    inserted_device_id = response.data[0]
    return inserted_device_id
