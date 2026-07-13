from common.supabase_client import supabase


def update_auth_user(
                        user_id: str,
                        password: str
                    ):
    print("update_auth_user")

    response = (
                    supabase.auth.admin.update_user_by_id(
                                                            user_id,
                                                            {
                                                                "password": password
                                                            }
                                                        )
               )

    return response