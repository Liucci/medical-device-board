from common.supabase_client import (supabase)

def refresh_token(refresh_token: str):
    print("refresh_token")
    print("received refresh token", refresh_token[:12])

    try:
        response = supabase.auth.refresh_session(refresh_token)
        print("refresh_session success")
        return response

    except Exception as e:
        print("refresh_session exception")
        print(type(e))
        print(repr(e))
        raise