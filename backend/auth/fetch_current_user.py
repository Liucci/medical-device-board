from common.supabase_client import (
    supabase
)

def fetch_current_user(
    auth_user_id: str
):

    response = (
        supabase
        .table("users")
        .select("""
            id,
            hospital_id,
            display_name,
            role,
            is_active
        """)
        .eq(
            "id",
            auth_user_id
        )
        .single()
        .execute()
    )

    return response.data