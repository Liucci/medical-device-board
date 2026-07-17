from fastapi import HTTPException


def check_permission(
                        current_user: dict,
                        allowed_roles: list[str]
                    ):
    print("check_permission")

    if current_user["role"] in allowed_roles:
        return

    raise HTTPException(
                        status_code=403,
                        detail="Permission denied"
    )