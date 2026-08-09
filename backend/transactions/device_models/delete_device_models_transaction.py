from device_models.delete_device_models import delete_device_models
from schemas.device_type_schemas import DeleteDeviceTypeRequest
from supabase import Client

def delete_device_models_transaction(
                                      client:Client,
                                      device_type: DeleteDeviceTypeRequest,
                                      hospital_id: str
                                  ):

    print("delete_device_models_transaction")


    delete_device_models(
                        client,
                        device_type,
                        hospital_id
                      )