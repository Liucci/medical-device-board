from device_types.delete_device_type import delete_device_type
from device_models.delete_device_models import delete_device_models_by_type_id
from schemas.device_type_schemas import DeleteDeviceTypeRequest
from supabase import Client

def delete_device_type_transaction(
                                    client:Client,
                                    device_type:DeleteDeviceTypeRequest,
                                    hospital_id:str
                                  ):
    print("delete_device_type_transaction")

#typeを消すとmodelも消える
    delete_device_models_by_type_id(
                                        client=client, 
                                        device_type=device_type,
                                        hospital_id=hospital_id
                                    )

    delete_device_type(
                        client, 
                        device_type.id,
                        hospital_id
                      )