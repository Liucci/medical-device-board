from supabase import Client

def register_auth_user(
                        client:Client,
                        email:str,
                        password:str
                      ):
    
    print("register_auth_user")
    response = (
                    client
                    .auth
                    .sign_up(
                                {
                                    "email": email,
                                    "password": password
                                }
                            )
               )

    return response