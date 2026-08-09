from supabase import Client


def delete_user(
                client:Client,
                user_id: str
                ):

    print("delete user")

    response = (
        client
        .table("users")
        .delete()
        .eq(
            "id",
            user_id
        )
        .execute()
    )

    return response.data[0]
