from common.supabase_client import supabase
from schemas.device_schemas import MoveDeviceRequest

def move_device(
                 device: MoveDeviceRequest,
                 hospital_id: str,
                 status:str
               ):

    print("move_device")

    response = (
                  supabase
                  .table("devices")
                  .update({
                              "room_id": device.room_id,
                              "stock_area_id": device.stock_area_id,
                              "status":status
                          })
                  .eq("id", device.id)
                  .eq("hospital_id", hospital_id)
                  .execute()
                )

    return response.data[0]