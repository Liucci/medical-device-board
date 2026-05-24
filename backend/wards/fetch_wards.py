from common.supabase_client import (
    supabase
)

def fetch_wards(

    hospital_id: str
):

    response = (
        supabase
        .table("wards")
        .select("*")
        .eq(
            "hospital_id",
            hospital_id
        )
        .execute()
    )

    return response.data