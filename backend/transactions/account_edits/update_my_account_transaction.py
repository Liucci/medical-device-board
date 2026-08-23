from account_edits.update_account_edit import (update_account_edit_code)
from transactions.account_edits.verify_account_edit_transaction import (verify_account_edit_code_transaction)
from users.update_my_account import update_my_account
from auth.update_auth_user import update_auth_user

from schemas.account_edit_schemas import (UpdateMyAccountRequest)
from supabase import Client
from common.supabase_admin_provider import get_admin_client

def update_my_account_transaction(
                                    client:Client,
                                    request: UpdateMyAccountRequest,
                                ):
    print("update_my_account_transaction")

    account_edit_code = verify_account_edit_code_transaction(
                                                                client=client, 
                                                                code=request.code
                                                            )

    update_my_account(
                        client=client, 
                        user_id=account_edit_code["user_id"],
                        display_name=request.display_name
                    )

    if request.password:
        #pasword変更なのでAuth Admin API
        #Auth Admin APIはadmin clientの必要がある
        admin_client = get_admin_client()
        update_auth_user(
                            client=admin_client, 
                            user_id=account_edit_code["user_id"],
                            password=request.password
                        )

    update_account_edit_code(
                                client=client, 
                                account_edit_code_id=account_edit_code["id"],
                                used=True
                            )

    return