#from common.supabase_admin_client import (supabase)
from common.get_auth_client_for_login import get_auth_client_for_login
def refresh_token(refresh_token: str):
    print("refresh_token")
    #print("received refresh token", refresh_token[:12])

    try:
        #print("before refresh", get_auth_client_for_login.postgrest.headers)
        response = get_auth_client_for_login().auth.refresh_session(refresh_token)
        
        #print("after refresh", get_auth_client_for_login.postgrest.headers)
        #print("refresh_session success")
        return response

    except Exception as e:
        #print("refresh_session exception")
        #print(type(e))
        #print(repr(e))
        raise