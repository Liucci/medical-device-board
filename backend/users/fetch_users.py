from common.supabase_client import (
    supabase
)

def fetch_users():

    response = (
        supabase
        .table("users")
        .select("*")
        .execute()
    )

    return response.data