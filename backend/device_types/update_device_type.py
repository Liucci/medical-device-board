from supabase import Client
from schemas.device_type_schemas import (UpdateDeviceTypeRequest, UpdateDeviceTypeOrderRequest)

def update_device_type(
                        client:Client,
                        device_type: UpdateDeviceTypeRequest,
                        hospital_id: str,
                      ):

    print("update_device_type")

    response = (
                  client
                  .table("device_types")
                  .update({
                            "name": device_type.name,
                            "icon_color": device_type.icon_color
                           })
                  .eq("id",device_type.id)
                  .eq("hospital_id",hospital_id)
                  .execute()
               )
    return response.data[0]

# 並び順更新用
def update_device_type_display_order(
                                    client: Client,
                                    device_type: UpdateDeviceTypeOrderRequest,
                                    hospital_id: str
):
    print("update_device_type_display_order")

    response = (
                client
                .table("device_types")
                .update({"display_order": device_type.display_order})
                .eq("id", device_type.id)
                .eq("hospital_id", hospital_id)
                .execute()
    )

    return response.data