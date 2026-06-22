from common.supabase_client import supabase
from schemas.device_type_schemas import UpdateDeviceTypeRequest

def update_device_type(
                        device_type: UpdateDeviceTypeRequest,
                        hospital_id: str,
                      ):

    print("update_device_type")

    response = (
                  supabase
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
