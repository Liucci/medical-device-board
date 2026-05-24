from fastapi import Header

from supabase import (
    create_client
)

from common.supabase_client import (
    supabase
)

def get_auth_user_id(

    authorization: str = Header(None)
):

    if not authorization:

        return None

    token = (
        authorization
        .replace(
            "Bearer ",
            ""
        )
    )

    response = (
        supabase.auth.get_user(
            token
        )
    )
    print("===== get_auth_user_id response =====")
    print(response.user.id)
    return response.user.id