from datetime import datetime, timezone

from account_edit_codes.fetch_account_edit_code import (
                                                        fetch_account_edit_code
                                                      )


def verify_account_edit_code_transaction(
                                            code: str
                                        ):
    print("verify_account_edit_code_transaction")

    account_edit_code = fetch_account_edit_code(
                                                    code=code
                                                )

    if not account_edit_code:
        raise Exception(
                            "Invalid account edit code"
                        )

    if account_edit_code["used"]:
        raise Exception(
                            "Account edit code already used"
                        )

    if (
            datetime.fromisoformat(
                                    account_edit_code["expires_at"]
                                  )
            < datetime.now(timezone.utc)
       ):
        raise Exception(
                            "Account edit code expired"
                        )

    return account_edit_code