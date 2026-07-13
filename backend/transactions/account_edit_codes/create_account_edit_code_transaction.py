import os

from account_edit_codes.create_account_edit_code import (create_account_edit_code)
from account_edit_codes.send_account_edit_mail import (send_account_edit_mail)
from schemas.account_edit_code_schemas import (CreateAccountEditCodeRequest,SendAccountEditMailRequest)

def create_account_edit_code_transaction(
                                            request: CreateAccountEditCodeRequest,
                                            email: str):
    print("create_account_edit_code_transaction")

    account_edit_code = create_account_edit_code(request=request)
    account_edit_url = (
                        f"{os.getenv('FRONTEND_URL')}"
                        f"/account-edit?code="
                        f"{account_edit_code['code']}"
                    )
    send_account_edit_mail(SendAccountEditMailRequest(
                                                    email=email,
                                                    account_edit_url=account_edit_url,
                                                    expires_at=account_edit_code["expires_at"]
                                                )
    )
    return account_edit_code