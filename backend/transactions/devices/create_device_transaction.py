from common.supabase_client import supabase

from devices.add_device import add_device

from stock_areas.fetch_stock_areas import fetch_stock_area

from device_types.fetch_device_type import fetch_device_type
from device_models.fetch_device_models import fetch_device_model

from schemas.device_schemas import AddDeviceRequest


def create_device_transaction(
                                device: AddDeviceRequest,
                                hospital_id: str,
                                user_id: str,
                                #stock_area_id: int,
                                status: str,
                                action_type: str,
                                message: str
                             ):

    print("create_device_transaction")

    stock_area = fetch_stock_area(
                                    device.stock_area_id,
                                    hospital_id
                                 )

    device_type = fetch_device_type(device.type,
                                      hospital_id
                                   )

    device_model = fetch_device_model(device.model,
                                        hospital_id
                                     )

    created_device = add_device(
                                  device=device,
                                  hospital_id=hospital_id,
                                  #stock_area_id=stock_area_id,
                                  status=status
                               )

    supabase.table("device_histories").insert({
                                                "hospital_id": hospital_id,
                                                "device_id": created_device["id"],
                                                "action_by": user_id,
                                                "action_type": action_type,
                                                "message": message,

                                                "device_type_name": device_type["name"],
                                                "device_model_name": device_model["name"],

                                                "stock_area_name": stock_area["name"]
                                              }).execute()

    return created_device