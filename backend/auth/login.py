from common.get_auth_client_for_login import (
    get_auth_client_for_login
)

def login_user(
    email: str,
    password: str
):
    print("login _user")

    response = (get_auth_client_for_login().auth.sign_in_with_password({
                            "email": email,
                            "password": password
                        })
        )

    
    return response