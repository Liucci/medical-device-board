from supabase import Client

#特定のhospitalの全device情報取得

def fetch_devices(
                    client: Client,
                    hospital_id: str,
                    ):
    print("fetch_devices")
    response = (
                client
                .table("devices")
                .select("*")
                .eq("hospital_id", hospital_id)
                .execute()
    )
    return response.data



#device idで指定した情報を取得
def fetch_device(
                  client: Client,
                  device_id: int,
                  hospital_id: str
                ):

    print("fetch_device")

    response = (
                  client
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
                              client:Client,
                              room_id: str,
                              hospital_id: str
                            ):

    print("fetch_devices_by_room_id")

    response = (
                  client
                  .table("devices")
                  .select("*")
                  .eq("room_id", room_id)
                  .eq("hospital_id", hospital_id)
                  .execute()
               )

    return response.data

from supabase import Client

#device typeで検索する
def fetch_devices_by_device_type_id(
                                            client: Client,
                                            device_type_id: int,
                                            hospital_id: str
                                        ):
    print("fetch_devices_by_device_type_id")

    response = (
        client
        .table("devices")
        .select("id")
        .eq("type", device_type_id)
        .eq("hospital_id", hospital_id)
        .execute()
    )

    return response.data or []

#複数のdevice modelに紐付くdeviceを抽出
def fetch_devices_by_device_model_ids(
    client: Client,
    device_model_ids: list[int],
    hospital_id: str
):
    print("fetch_devices_by_device_model_ids")

    response = (
        client
        .table("devices")
        .select("id")
        .in_("model", device_model_ids)
        .eq("hospital_id", hospital_id)
        .execute()
    )

    return response.data or []


#すべてのdevice情報を取得
def fetch_all_devices(client:Client,):

    print("fetch_all_devices")

    response = (
        client
        .table("devices")
        .select("*")
        .execute()
    )

    return response.data