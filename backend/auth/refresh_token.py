#from common.supabase_admin_client import (supabase)
from common.supabase_auth_client import supabase_auth
def refresh_token(refresh_token: str):
    print("refresh_token")
    #print("received refresh token", refresh_token[:12])

    try:
        response = supabase_auth.auth.refresh_session(refresh_token)
        print("refresh_session success")
        return response

    except Exception as e:
        print("refresh_session exception")
        print(type(e))
        print(repr(e))
        raise