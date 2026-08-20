from supabase import Client
from schemas.device_type_schemas import (AddDeviceTypeRequest)

def add_device_type(
                    client:Client,
                    device_type: AddDeviceTypeRequest,
                    hospital_id:str
                    ):
    
    
    print("insert device_type")
    response = (
        client
        .table("device_types")
        .insert({
                "hospital_id":hospital_id,
                "name":device_type.name,
                "icon_color": device_type.icon_color
        })
        .execute()
    )
    return response.data[0]

