from common.supabase_client import (supabase)

def refresh_token(refresh_token: str):
    print("refresh_token")
    print(
        "received refresh token",
        refresh_token[:12]
    )
    response = (supabase.auth.refresh_session(refresh_token))
    return response