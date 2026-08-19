from common.supabase_admin_client import (supabase)
from supabase import Client
from schemas.device_model_schemas import UpdateDeviceModelRequest

def update_device_model(
                         client:Client,
                         device_model: UpdateDeviceModelRequest,
                        hospital_id: str                        ):
    print("update_device_model")
    response = (
                client
                .table("device_models")
                .update({
                        "name": device_model.name,
                        "display_remaining_count": device_model.display_remaining_count,
                        "remaining_alert_count": device_model.remaining_alert_count
                        })
                .eq("id",device_model.id)
                .eq("hospital_id",hospital_id)
                .execute()
    )
    return response.data[0]
