from common.supabase_client import supabase


def register_auth_user(
                        email:str,
                        password:str
                      ):

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