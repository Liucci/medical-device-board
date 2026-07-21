from common.supabase_admin_client import supabase
from common.supabase_admin_client import key

def update_auth_user(
                        user_id: str,
                        password: str
                    ):
    print("update_auth_user")
    # print("user_id =", user_id)
    # print("password =", password)
    # print("service key =", key[:20])


    response = (
                    supabase.auth.admin.update_user_by_id(
                                                            user_id,
                                                            {
                                                                "password": password
                                                            }
                                                        )
               )

    return response