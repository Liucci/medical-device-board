from common.supabase_client import (supabase)
from schemas.device_type_schemas import (AddDeviceTypeRequest)

def add_device_type(device_type: AddDeviceTypeRequest,
                    hospital_id:str
                    ):
    
    
    print("insert device_type")
    response = (
        supabase
        .table("device_types")
        .insert({
                "hospital_id":hospital_id,
                "name":device_type.name
        })
        .execute()
    )
    return response.data[0]

