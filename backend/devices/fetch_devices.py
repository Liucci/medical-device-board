from common.supabase_client import (
    supabase
)

def fetch_devices(hospital_id: int):
    print("fetch_devices")
    response = (
        supabase
        .table("devices")
        .select("*")
        .eq(
            "hospital_id",
            hospital_id
        )
        .execute()
    )
    return response.data

    