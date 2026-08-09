from supabase import Client


def fetch_account_edit_code(
                                client:Client,
                                code: str
                            ):
    print("fetch_account_edit_code")

    response = (
                    client
                    .table("account_edit_codes")
                    .select("*")
                    .eq(
                        "code",
                        code
                    )
                    .single()
                    .execute()
               )

    return response.data