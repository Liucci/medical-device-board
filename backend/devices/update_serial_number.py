from common.supabase_admin_client import supabase
from schemas.device_schemas import UpdateSerialNumberRequest
from datetime import datetime, timezone
def update_serial_number(
                          device: UpdateSerialNumberRequest,
                          hospital_id: str,
                          user_id:str
                        ):

    print("update_serial_number")

    response = (
                  supabase
                  .table("devices")
                  .update({
                              "serial_number": device.serial_number,
                              "updated_by": user_id,
                              "updated_at": datetime.now(timezone.utc).isoformat()
                          })
                  .eq("id", device.id)
                  .eq("hospital_id", hospital_id)
                  .execute()
                )

    return response.data[0]