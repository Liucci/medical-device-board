from schemas.user_schemas import UpdateUserRequest
from supabase import Client

from users.update_user import update_user
from auth.fetch_current_user import fetch_current_user
from transactions.auth.fetch_current_user_transaction import fetch_current_user_transaction


def update_user_transaction(
                            client:Client,
                            request: UpdateUserRequest,
                            auth_user_id: str
):
    print("update_user_transaction")
    current_user = fetch_current_user_transaction(
                                                    client,
                                                    auth_user_id
                                                    )
    if current_user.role!= "system_admin":
        raise PermissionError("Permission denied")

    update_user(
                client, 
                request
                )