from schemas.device_type_schemas import UpdateDeviceTypeRequest
from device_types.update_device_type import update_device_type
from supabase import Client

def update_device_type_transaction(
                                    client:Client,
                                    device_type: UpdateDeviceTypeRequest,
                                    hospital_id:str
                                  ):
    print("update_device_type_transaction")

    return update_device_type(
                              client, 
                              device_type,
                              hospital_id
                            )