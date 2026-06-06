from device_models.update_device_model import update_device_model
from schemas.device_model_schemas import UpdateDeviceModelRequest

def update_device_model_transaction(
                                        device_model: UpdateDeviceModelRequest,
                                        hospital_id: str
                                    ):

    print("update_device_model_transaction")

    return update_device_model(
                                device_model,
                                hospital_id
                              )