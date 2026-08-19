from device_types.add_device_type import add_device_type
from schemas.device_type_schemas import (AddDeviceTypeRequest)
from supabase import Client

def create_device_type_transaction(
                                    client:Client,
                                    device_type:AddDeviceTypeRequest,
                                    hospital_id:str
                                  ):

    print("create_device_type_transaction")

    add_device_type(
                    client, 
                    device_type,
                    hospital_id
                    )