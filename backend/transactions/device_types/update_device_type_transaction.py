from schemas.device_type_schemas import UpdateDeviceTypeRequest
from device_types.update_device_type import update_device_type

def update_device_type_transaction(
                                    device_type: UpdateDeviceTypeRequest,
                                    hospital_id:str
                                  ):
    print("update_device_type_transaction")

    return update_device_type(
                    device_type,
                    hospital_id
                  )