from common.supabase_admin_client import supabase


def register_auth_user(
                        email:str,
                        password:str
                      ):
    print("register_auth_user")
    response = (
                    supabase
                    .auth
                    .sign_up(
                                {
                                    "email": email,
                                    "password": password
                                }
                            )
               )

    return response