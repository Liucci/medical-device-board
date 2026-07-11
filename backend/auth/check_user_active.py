from fastapi import HTTPException

from auth.fetch_current_user import fetch_current_user
from hospitals.fetch_hospital import fetch_hospital


def check_user_active(auth_user_id: str):
    print("check_user_active")

    user = fetch_current_user(auth_user_id)

    if not user["is_active"]:
        raise HTTPException(
            status_code=403,
            detail="User account is inactive"
        )

    print("user active")

    hospital = fetch_hospital(user["hospital_id"])

    if not hospital["is_active"]:
        raise HTTPException(
            status_code=403,
            detail="Hospital is inactive"
        )

    print("hospital active")