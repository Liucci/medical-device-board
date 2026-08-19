
from supabase import Client

from schemas.device_type_schemas import (DeleteDeviceTypeRequest)
def delete_device_type(
                       client:Client,
                       device_type:DeleteDeviceTypeRequest,
                       hospital_id:str
                       ):
    print(f"delete device_type")
    response = (
        client
        .table("device_types")
        .delete()
        .eq("id",device_type)
        .eq("hospital_id",hospital_id)
        .execute()
    )
    return response.data[0]

