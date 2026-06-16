from fastapi import Header
from common.supabase_client import (supabase)

def get_auth_user_id(authorization: str = Header(None)):

    if not authorization:
        return None

    token = authorization.replace(
                                    "Bearer ",
                                    ""
                                )
    try:
        response = supabase.auth.get_user(token)
        return response.user.id

    except Exception:
        return None
