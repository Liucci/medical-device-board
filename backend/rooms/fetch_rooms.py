from common.supabase_client import (
    supabase
)

def fetch_rooms(

    hospital_id: str
):

    response = (
        supabase
        .table("rooms")
        .select("*")
        .eq(
            "hospital_id",
            hospital_id
        )
        .execute()
    )

    return response.data