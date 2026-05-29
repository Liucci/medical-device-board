from common.supabase_client import (
    supabase
)

from schemas.master_schemas import (
    AddDeviceTypeRequest,
    AddDeviceModelRequest
)

def add_device_type(device_type: AddDeviceTypeRequest):
    print("insert device_type")
    response = (
        supabase
        .table("device_types")
        .insert({
            "hospital_id":
                device_type.hospital_id,

            "name":
                device_type.name,

            "color":
                device_type.color,

            "icon":
                device_type.icon,

            "created_by":
                device_type.created_by,

            "updated_by":
                device_type.updated_by
        })
        .execute()
    )
    return response.data[0]

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
