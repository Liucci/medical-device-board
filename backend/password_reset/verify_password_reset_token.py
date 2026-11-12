
from datetime import datetime, timezone

from password_reset.create_password_reset_token import password_reset_tokens

#Backendのメモリ上に保持しているセッション情報と、Cookieから取得した session_id を照合します。
def verify_password_reset_token(reset_token: str):
    print("verify_password_reset_tokens")

    if not reset_token:
        return False

    reset_token_data = password_reset_tokens.get(reset_token)

    if not reset_token_data:
        return False

    if reset_token_data["expires_at"] < datetime.now(timezone.utc):
        password_reset_tokens.pop(reset_token, None)
        return False

    return True
