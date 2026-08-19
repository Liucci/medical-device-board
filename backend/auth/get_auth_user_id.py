from fastapi import Header, HTTPException
from common.get_auth_client_for_login import get_auth_client_for_login

def get_auth_user_id(authorization: str = Header(None)):
    print("get_auth_user_id")

    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Authorization header missing"
        )

    token = authorization.replace("Bearer ", "")

    try:
        response = get_auth_client_for_login().auth.get_user(token)

        if response.user is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

        return response.user.id

    except Exception as e:
        print(e)

        raise HTTPException(
            status_code=401,
            detail="Token expired or invalid"
        )