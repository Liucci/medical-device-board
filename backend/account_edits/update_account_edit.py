from supabase import Client


def update_account_edit_code(
                                client:Client,
                                account_edit_code_id: int,
                                used: bool
                            ):
    print("update_account_edit_code")

    response = (
                    client
                    .table("account_edit_codes")
                    .update(
                                {
                                    "used": used
                                }
                           )
                    .eq(
                        "id",
                        account_edit_code_id
                    )
                    .execute()
               )

    return response.data