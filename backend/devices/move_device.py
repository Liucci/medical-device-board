from common.supabase_admin_client import supabase
from datetime import datetime, timezone
from schemas.device_schemas import MoveDeviceRequest

def move_device(
                 device: MoveDeviceRequest,
                 hospital_id: str,
                 status:str,
                 user_id:str
               ):

    print("move_device")

    response = (
                  supabase
                  .table("devices")
                  .update({
                              "room_id": device.room_id,
                              "stock_area_id": device.stock_area_id,
                              "status":status,
                              "updated_by": user_id,
                              "updated_at": datetime.now(timezone.utc).isoformat()
                          })
                  .eq("id", device.id)
                  .eq("hospital_id", hospital_id)
                  .execute()
                )

    return response.data[0]