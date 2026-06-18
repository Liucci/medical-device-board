from common.supabase_client import (supabase)
from schemas.device_model_schemas import UpdateDeviceModelRequest

def update_device_model(
                        device_model: UpdateDeviceModelRequest,
                        hospital_id: str                        ):
    print("update_device_model")
    response = (
        supabase
        .table("device_models")
        .update({"name": device_model.name,})
        .eq("id",device_model.id)
        .eq("hospital_id",hospital_id)
        .execute()
    )
    return response.data[0]
