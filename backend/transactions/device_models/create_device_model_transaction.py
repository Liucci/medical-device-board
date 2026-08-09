from device_models.add_device_model import add_device_model
from schemas.device_model_schemas import AddDeviceModelRequest
from supabase import Client

def create_device_model_transaction(
                                        client:Client,
                                        device_model: AddDeviceModelRequest,
                                        hospital_id: str
                                    ):
    print("create_device_model_transaction")

    return add_device_model(
                                client=client, 
                                device_model=device_model,
                                hospital_id=hospital_id
                            )