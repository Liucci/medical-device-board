from common.supabase_client import supabase
from schemas.device_schemas import UpdateManagementNumberRequest

def update_management_number(
                              device: UpdateManagementNumberRequest,
                              hospital_id: str
                            ):

    print("update_management_number")

    response = (
                  supabase
                  .table("devices")
                  .update({
                              "management_number": device.management_number
                          })
                  .eq("id", device.id)
                  .eq("hospital_id", hospital_id)
                  .execute()
                )

    return response.data[0]