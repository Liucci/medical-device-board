from supabase import Client

#display nameのみ変更する
def update_my_account(
                        client:Client,
                        user_id: str,
                        display_name: str
                     ):
    print("update_my_account")

    response = (
                    client
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