
import re
from datetime import datetime, timezone
from supabase import Client

from password_reset.verify_password_reset_token import verify_password_reset_token
from password_reset.create_password_reset_token import password_reset_tokens
from password_reset.fetch_password_reset_code import fetch_password_reset_code
from password_reset.update_password_reset_code import update_password_reset_code
from users.fetch_user_by_email import fetch_user_by_email
from password_reset.update_auth_user_password import update_auth_user_password
from password_reset.send_password_reset_completed_mail import send_password_reset_completed_mail


# パスワード変更Transaction
def update_password_reset_transaction(
    client: Client,
    reset_token: str,
    code: str,
    new_password: str
):
    print("update_password_reset_transaction")

    # reset_tokenの有効性確認
    is_valid = verify_password_reset_token(reset_token=reset_token)
    if not is_valid:
        return None

    # reset_tokenに紐づくメールアドレスを取得
    reset_token_data = password_reset_tokens.get(reset_token)
    if not reset_token_data:
        return None

    email = reset_token_data["email"]

    # 認証コード取得
    password_reset_code = fetch_password_reset_code(client=client, code=code)
    if not password_reset_code:
        return None

    # 認証コードの未使用確認
    if password_reset_code["used"]:
        return None

    # 認証コードの有効期限確認
    expires_at = datetime.fromisoformat(
        password_reset_code["expires_at"].replace("Z", "+00:00")
    )

    if expires_at < datetime.now(timezone.utc):
        return None

    # 認証コードとreset_tokenのメールアドレス照合
    if password_reset_code["email"] != email:
        return None

    # パスワード条件確認
    if len(new_password) < 6:
        return None

    if not re.search(r"[a-zA-Z]", new_password):
        return None

    if not re.search(r"[0-9]", new_password):
        return None

    if not re.fullmatch(r"[!-~]+", new_password):
        return None

    # ユーザー検索
    users = fetch_user_by_email(client=client, email=email)
    if not users:
        return None

    user_id = users[0]["id"]

    # Supabase Authのパスワード更新
    update_auth_user_password(
                                client=client,
                                user_id=user_id,
                                new_password=new_password
    )

    # 認証コードを使用済みに更新
    update_password_reset_code(
                                client=client,
                                password_reset_code_id=password_reset_code["id"],
                                used=True
    )

    # メモリ上のreset_tokenを削除
    password_reset_tokens.pop(reset_token, None)

    # パスワード変更完了メール送信
    try:
        send_password_reset_completed_mail(email=email)
    except Exception as error:
        print("send_password_reset_completed_mail error:", error)

    return {
        "message": "パスワードを変更しました"
    }
