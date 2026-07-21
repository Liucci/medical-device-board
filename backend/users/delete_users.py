from common.supabase_admin_client import (
    supabase
)

def delete_user(user_id: str):

    print("delete user")

    response = (
        supabase
        .table("users")
        .delete()
        .eq(
            "id",
            user_id
        )
        .execute()
    )

    return response.data[0]
