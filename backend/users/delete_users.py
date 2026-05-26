from common.supabase_client import (
    supabase
)

def delete_user(
                user_id: str
                ):

    print(f"delete user_id: {user_id}")

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

    print("delete response")

    for row in response.data:
        print(f"・{row}")

    return {
            "success": True,
            "user": response.data[0]
            }