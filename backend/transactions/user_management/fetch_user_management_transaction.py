from hospitals.fetch_hospital import fetch_hospitals
from users.fetch_users import fetch_users
from schemas.user_schemas import UserResponse
from schemas.user_schemas import UserManagementResponse
from supabase import Client


def fetch_user_management_transaction(client:Client):

    print("fetch_user_management_transaction")

    users = fetch_users(client=client,)
    hospitals = fetch_hospitals(client=client,)

    hospital_map = {
                    hospital["id"]: hospital["hospital_name"]
                    for hospital in hospitals
    }

    responses = [
                    UserManagementResponse(
                                id=user["id"],
                                hospital_name=hospital_map.get(user["hospital_id"], ""),
                                email=user["email"],
                                display_name=user["display_name"],
                                role=user["role"],
                                is_active=user["is_active"],
                                created_at=user["created_at"],
                                updated_at=user["updated_at"]
                            )
                            for user in users
    ]

    return responses