from hospitals.fetch_hospital import fetch_hospital
from users.fetch_users import fetch_users
from schemas.user_schemas import FetchCurrentUserResponse

def fetch_current_user_transaction(
                                    auth_user_id:str
                                  ):
    print("fetch_current_user_transaction")
    user = fetch_users(
                        auth_user_id
                     )

    if not user:
        raise Exception(
                            "User not found"
                       )

    hospital = fetch_hospital(
                                user["hospital_id"]
                             )

    if not hospital:
        raise Exception(
                            "Hospital not found"
                       )

    return FetchCurrentUserResponse(
                            id=user["id"],
                            email=user["email"],
                            display_name=user["display_name"],
                            role=user["role"],
                            hospital_id=user["hospital_id"],
                            hospital_name=hospital["hospital_name"],
                            is_active=user["is_active"]
                       )