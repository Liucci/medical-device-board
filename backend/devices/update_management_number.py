from common.supabase_admin_client import supabase
from schemas.device_schemas import UpdateManagementNumberRequest
from datetime import datetime, timezone
def update_management_number(
                              device: UpdateManagementNumberRequest,
                              hospital_id: str,
                              user_id:str
                            ):

    print("update_management_number")

    response = (
                  supabase
                  .table("devices")
                  .update({
                              "management_number": device.management_number,
                              "updated_by": user_id,
                              "updated_at": datetime.now(timezone.utc).isoformat()
                          })
                  .eq("id", device.id)
                  .eq("hospital_id", hospital_id)
                  .execute()
                )

    return response.data[0]