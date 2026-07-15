from common.supabase_admin_client import supabase
#特定のhospitalの全device情報取得
def fetch_devices(hospital_id: str):

    print("fetch_devices")

    response = (
                  supabase
                  .table("devices")
                  .select("*")
                  .eq("hospital_id", hospital_id)
                  .execute()
                )

    return response.data

#device idで指定した情報を取得
def fetch_device(
                  device_id: int,
                  hospital_id: str
                ):

    print("fetch_device")

    response = (
                  supabase
                  .table("devices")
                  .select("*")
                  .eq("id", device_id)
                  .eq("hospital_id", hospital_id)
                  .single()
                  .execute()
               )

    return response.data
#特定のroom内のdevice情報を取得
    
def fetch_devices_by_room_id(
                              room_id: str,
                              hospital_id: str
                            ):

    print("fetch_devices_by_room_id")

    response = (
                  supabase
                  .table("devices")
                  .select("*")
                  .eq("room_id", room_id)
                  .eq("hospital_id", hospital_id)
                  .execute()
               )

    return response.data

#すべてのdevice情報を取得
def fetch_all_devices():

    print("fetch_all_devices")

    response = (
        supabase
        .table("devices")
        .select("*")
        .execute()
    )

    return response.data