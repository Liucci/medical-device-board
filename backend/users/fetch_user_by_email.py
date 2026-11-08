from supabase import Client


def fetch_user_by_email(
                            client: Client,
                            email: str
):
    print("fetch_user_by_email")

    response = (
        client
        .table("users")
        .select("id, email")
        .eq("email", email)
        .maybe_single()
        .execute()
    )

    return response.data