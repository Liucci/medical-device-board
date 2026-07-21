from common.supabase_admin_client import supabase


def update_account_edit_code(
                                account_edit_code_id: int,
                                used: bool
                            ):
    print("update_account_edit_code")

    response = (
                    supabase
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