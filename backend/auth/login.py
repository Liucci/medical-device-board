from supabase import Client

from common.supabase_client import (
    supabase
)

def login_user(
    email: str,
    password: str
):

    response = (
        supabase.auth.sign_in_with_password({

            "email": email,
            "password": password
        })
    )

    return response