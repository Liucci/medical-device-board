from device_models.delete_device_models import delete_device_models
from schemas.device_type_schemas import DeleteDeviceTypeRequest

def delete_device_models_transaction(
                                      device_type: DeleteDeviceTypeRequest,
                                      hospital_id: str
                                  ):

    print("delete_device_models_transaction")


    delete_device_models(
                        device_type,
                        hospital_id
                      )