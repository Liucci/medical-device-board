from device_models.update_device_model import update_device_model
from schemas.device_model_schemas import UpdateDeviceModelRequest
from supabase import Client

def update_device_model_transaction(
                                        client:Client,
                                        device_model: UpdateDeviceModelRequest,
                                        hospital_id: str
                                    ):

    print("update_device_model_transaction")

    return update_device_model(
                                client,
                                device_model,
                                hospital_id
                              )