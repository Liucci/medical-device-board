
from password_reset.create_password_reset_token import (
    password_reset_tokens
)

from password_reset.verify_password_reset_token import (
    verify_password_reset_token
)

#reset_tokenから申請時のメールアドレスを取得する
def fetch_password_reset_email_transaction(reset_token: str):

    print("fetch_password_reset_email_transaction")

    # reset_tokenの有効性確認
    is_valid = verify_password_reset_token(
        reset_token=reset_token
    )

    if not is_valid:
        return None

    # reset_tokenに紐づくメールアドレスを取得
    reset_token_data = password_reset_tokens.get(
        reset_token
    )

    if not reset_token_data:
        return None

    email = reset_token_data["email"]

    return {
        "email": email
    }
