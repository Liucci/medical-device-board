from common.supabase_client import (supabase)

def fetch_maintenance_types(hospital_id: str):
    print("fetch_maintenance_types")
    response = (
    supabase
    .table("maintenance_types")
    .select("*")
    .eq(
        "hospital_id",
        hospital_id
    )
    .execute()
)

    return response.data
