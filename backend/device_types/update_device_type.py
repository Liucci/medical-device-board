from supabase import Client
from schemas.device_type_schemas import UpdateDeviceTypeRequest

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
