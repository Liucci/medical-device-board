from device_types.add_device_type import add_device_type
from schemas.device_type_schemas import (AddDeviceTypeRequest)

def create_device_type_transaction(
                                    device_type:AddDeviceTypeRequest,
                                    hospital_id:str
                                  ):

    print("create_device_type_transaction")

    add_device_type(
                    device_type,
                    hospital_id
                    )