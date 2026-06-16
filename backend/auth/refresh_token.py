from common.supabase_client import (supabase)

def refresh_token(refresh_token: str):
    print("refresh token")
    response = (supabase.auth.refresh_session(refresh_token))
    return response