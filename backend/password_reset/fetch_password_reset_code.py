from supabase import Client


def fetch_password_reset_code(
                                client: Client,
                                code: str
):
    print("fetch_password_reset_code")

    response = (
        client
        .table("password_reset_codes")
        .select("*")
        .eq(
            "code",
            code
        )
        .single()
        .execute()
    )

    return response.data