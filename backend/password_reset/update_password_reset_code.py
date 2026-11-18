from supabase import Client


def update_password_reset_code(
                                client: Client,
                                password_reset_code_id: int,
                                used: bool
):
    print("update_password_reset_code")

    response = (
        client
        .table("password_reset_codes")
        .update(
            {
                "used": used
            }
        )
        .eq(
            "id",
            password_reset_code_id
        )
        .execute()
    )

    return response.data