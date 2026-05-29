from common.supabase_client import (
    supabase
)

def fetch_histories(hospital_id: str):
    response = (
        supabase
        .table("device_histories")
        .select("*")
        .eq(
            "hospital_id",
            hospital_id
        )
        .execute()
    )
    return response.data
    
