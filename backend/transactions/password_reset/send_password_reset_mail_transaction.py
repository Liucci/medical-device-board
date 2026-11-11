import os
from datetime import datetime
from supabase import Client
from password_reset.verify_password_reset_token import verify_password_reset_token
from password_reset.create_password_reset_token import password_reset_tokens
from users.fetch_user_by_email import fetch_user_by_email
from password_reset.create_password_reset_code import create_password_reset_code
from password_reset.send_password_reset_mail import send_password_reset_mail


# 本人確認ページの初期化時に呼び出す処理
def send_password_reset_mail_transaction(client: Client, reset_token: str):
    print("send_password_reset_mail_transaction")

    # reset_tokenの有効性確認
    is_valid = verify_password_reset_token(reset_token=reset_token)
    print("verify_password_reset_token:", is_valid)
    if not is_valid:
        return None

    # reset_tokenに紐づくメールアドレスを取得
    reset_token_data = password_reset_tokens.get(reset_token)
    print("reset_token_data:", bool(reset_token_data))
    if not reset_token_data:
        return None

    email = reset_token_data["email"]
    print("email:", email)
    print("client:", client)
    print("client type:", type(client))
    
    # ユーザー検索
    user = fetch_user_by_email(client=client, email=email)
    print("fetch_user_by_email:", bool(user))
    if not user:
        return None

    # 認証コード発行・DB保存
    password_reset_code = create_password_reset_code(client=client, email=email)
    print("create_password_reset_code:", bool(password_reset_code))

    # 有効期限をdatetimeに変換
    expires_at = datetime.fromisoformat(password_reset_code["expires_at"].replace("Z", "+00:00"))

    # パスワード変更ページURL
    reset_url = f"{os.getenv('FRONTEND_URL')}/password-reset?code={password_reset_code['code']}"

    # パスワード変更メール送信
    send_password_reset_mail(email=email, reset_url=reset_url, expires_at=expires_at)
    print("send_password_reset_mail: completed")

    return {
        "message": "パスワード変更メールを送信しました",
        "email": email
    }
