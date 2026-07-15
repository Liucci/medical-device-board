from common.supabase_admin_client import supabase
from schemas.device_model_schemas import AddDeviceModelRequest

def add_device_model(
                        device_model: AddDeviceModelRequest,
                        hospital_id: str
                    ):
    print("insert device_model")

    response = (
        supabase
        .table("device_models")
        .insert({
            "hospital_id": hospital_id,
            "device_type_id": device_model.device_type_id,
            "name": device_model.name
        })
        .execute()
    )

    return response.data[0]