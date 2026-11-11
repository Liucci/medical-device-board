import os

from password_reset.create_password_reset_token import (
    create_password_reset_token
)

from password_reset.send_verification_mail import (
    send_verification_mail
)


def create_password_reset_request_transaction(email: str):

    print("create_password_reset_request_transaction")

    # reset_token発行
    reset_token, expires_at = create_password_reset_token(email=email)
    # 本人確認ページURL
    verification_url = (
        f"{os.getenv('FRONTEND_URL')}"
        f"/password-reset/verify"
    )
    print("verification_url:", verification_url)
    # 本人確認メール送信
    send_verification_mail(
        email=email,
        verification_url=verification_url,
        expires_at=expires_at
    )

    return {
        "reset_token": reset_token,
        "expires_at": expires_at
    }