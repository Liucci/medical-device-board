from device_models.add_device_model import add_device_model
from schemas.device_model_schemas import AddDeviceModelRequest

def create_device_model_transaction(
                                        device_model: AddDeviceModelRequest,
                                        hospital_id: str
                                    ):
    print("create_device_model_transaction")

    return add_device_model(
                                device_model=device_model,
                                hospital_id=hospital_id
                            )