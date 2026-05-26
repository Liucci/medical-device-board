from common.supabase_client import (
    supabase
)

def rename_user(
                user_id: str,
                name: str | None = None,
                role: str | None = None,
                email: str | None = None
                ):

    print(f"rename user_id: {user_id}")
    print(f"name: {name}")
    print(f"role: {role}")
    print(f"email: {email}")

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

    print("rename response")

    for row in response.data:
        print(f"・{row}")

    return {
            "success": True,
            "user": response.data[0]
            }