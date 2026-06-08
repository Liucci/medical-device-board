from common.supabase_client import supabase

def fetch_maintenance_tasks(
    hospital_id: str
):

    response = (
        supabase
        .table("device_maintenance_tasks")
        .select("*")
        .eq(
            "hospital_id",
            hospital_id
        )
        .execute()
    )

    return response.data