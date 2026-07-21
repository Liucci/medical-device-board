from common.supabase_admin_client import supabase


def fetch_account_edit_code(
                                code: str
                            ):
    print("fetch_account_edit_code")

    response = (
                    supabase
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