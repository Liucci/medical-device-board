from account_edit_codes.update_account_edit_code import (
                                                            update_account_edit_code
                                                        )
from transactions.account_edit_codes.verify_account_edit_code_transaction import (
                                                                                    verify_account_edit_code_transaction
                                                                                )
from users.update_my_account import update_my_account
from auth.update_auth_user import update_auth_user

from schemas.account_edit_code_schemas import (
                                                    UpdateMyAccountRequest
                                                )


def update_my_account_transaction(
                                    request: UpdateMyAccountRequest
                                ):
    print("update_my_account_transaction")

    account_edit_code = verify_account_edit_code_transaction(
                                                                code=request.code
                                                            )

    update_my_account(
                        user_id=account_edit_code["user_id"],
                        display_name=request.display_name
                    )

    if request.password:
        update_auth_user(
                            user_id=account_edit_code["user_id"],
                            password=request.password
                        )

    update_account_edit_code(
                                account_edit_code_id=account_edit_code["id"],
                                used=True
                            )

    return