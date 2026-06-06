from common.supabase_client import (supabase)
from schemas.device_model_schemas import DeleteDeviceModelsRequest
from schemas.device_type_schemas import DeleteDeviceTypeRequest


#直接modelを消す場合
def delete_device_models(
                            device_model:DeleteDeviceModelsRequest,
                            hospital_id:str
                        ):

    print("delete device_models")

    (
        supabase
        .table("device_models")
        .delete()
        .in_("id",device_model.ids)
        .eq("hospital_id",hospital_id)
        .execute()
    )


#type削除によって紐づいているmodelが削除される場合
def delete_device_models_by_type_id(
                                        device_type:DeleteDeviceTypeRequest,
                                        hospital_id:str
                                    ):

    print("delete device_models by type ids")

    (
        supabase
        .table("device_models")
        .delete()
        .eq("device_type_id",device_type.id)
        .eq("hospital_id",hospital_id)
        .execute()
    )