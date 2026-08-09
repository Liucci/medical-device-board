from fastapi import HTTPException
from supabase import Client

from auth.fetch_current_user import fetch_current_user
from hospitals.fetch_hospital import fetch_hospital
from transactions.auth.fetch_current_user_transaction import fetch_current_user_transaction


def check_user_active(
                    client:Client,
                    auth_user_id: str
                    ):
    print("check_user_active")

    user = fetch_current_user_transaction(
                                        client, 
                                        auth_user_id
                                        )

    if not user.is_active:
        raise HTTPException(
            status_code=403,
            detail="User account is inactive"
        )

    print("user active")

    hospital = fetch_hospital(
                            client, 
                            user.hospital_id
                            )

    if not hospital["is_active"]:
        raise HTTPException(
                            status_code=403,
                            detail="Hospital is inactive"
                        )

    print("hospital active")