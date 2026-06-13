from common.supabase_client import supabase

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
    