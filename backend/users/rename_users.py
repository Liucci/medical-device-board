from common.supabase_client import (
    supabase
)

def rename_user(
                user_id: str,
                name: str | None = None,
                role: str | None = None,
                email: str | None = None
                ):

    print("rename_user")
    response = (
        supabase
        .table("users")
        .update({
            "name": name,
            "role": role,
            "email": email
        })
        .eq(
            "id",
            user_id
        )
        .execute()
    )

    return response.data[0]
