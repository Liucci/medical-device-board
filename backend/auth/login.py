from supabase import Client

from common.supabase_client import (
    supabase
)

def login_user(
    email: str,
    password: str
):
    print("login _user")

    response = (supabase.auth.sign_in_with_password({
                            "email": email,
                            "password": password
                        })
        )
    """     print("login情報")
        for a in response:
            print(f"・{a}") 
    """


    print(
        "login refresh token",
        response.session.refresh_token[:12]
    )
    return response