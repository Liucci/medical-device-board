from common.supabase_client import supabase

def fetch_ward_last_updated(
    hospital_id:str
):

    print("fetch_ward_last_updated")

    response = (
        supabase
        .table("devices")
        .select("updated_at")
        .eq("hospital_id",hospital_id)
        .eq("status", "room")
        .order("updated_at", desc=True)
        .limit(1)
        .execute()
    )

    return response.data[0]["updated_at"] if response.data else None