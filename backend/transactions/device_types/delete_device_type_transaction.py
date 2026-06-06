from device_types.delete_device_type import delete_device_type
from device_models.delete_device_models import delete_device_models_by_type_id
from schemas.device_type_schemas import DeleteDeviceTypeRequest

def delete_device_type_transaction(
                                    device_type:DeleteDeviceTypeRequest,
                                    hospital_id:str
                                  ):
#typeを消すとmodelも消える
    delete_device_models_by_type_id(
                                        device_type=device_type,
                                        hospital_id=hospital_id
                                    )

    delete_device_type(
                        device_type.id,
                        hospital_id
                      )