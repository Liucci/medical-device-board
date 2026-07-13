from common.supabase_client import supabase

#display nameのみ変更する
def update_my_account(
                        user_id: str,
                        display_name: str
                     ):
    print("update_my_account")

    response = (
                    supabase
                    .table("users")
                    .update(
                                {
                                    "display_name": display_name
                                }
                           )
                    .eq(
                            "id",
                            user_id
                       )
                    .execute()
               )

    return response.data