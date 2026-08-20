from supabase import Client

def update_auth_user(
                        client:Client,
                        user_id: str,
                        password: str
                    ):
    print("update_auth_user")


    response = (
                    client.auth.admin.update_user_by_id(
                                                            user_id,
                                                            {
                                                                "password": password
                                                            }
                                                        )
               )

    return response