from common.supabase_client import (supabase)

def add_device_model(device_model: AddDeviceModelRequest):
    print("insert device_model")
    response = (
        supabase
        .table("device_models")
        .insert({
            "hospital_id":
                device_model.hospital_id,

            "device_type_id":
                device_model.device_type_id,

            "name":
                device_model.name,

            "manufacturer":
                device_model.manufacturer,

            "created_by":
                device_model.created_by,

            "updated_by":
                device_model.updated_by
        })
        .execute()
    )
    return response.data[0]
