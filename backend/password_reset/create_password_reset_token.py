
import secrets
from datetime import datetime, timedelta, timezone

# 申請した端末・ブラウザを識別するための reset tokenを生成する処理
password_reset_tokens = {}


def create_password_reset_token(email: str):
    print("create_password_reset_token")

    reset_token = secrets.token_urlsafe(32)
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=30)

    password_reset_tokens[reset_token] = {
        "email": email,
        "expires_at": expires_at
    }

    return reset_token, expires_at
