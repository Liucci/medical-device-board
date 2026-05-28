from common.supabase_client import (
    supabase
)

def rename_user(
                user_id: str,
                name: str | None = None,
                role: str | None = None,
                email: str | None = None
                ):


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

        return response.data[0]
