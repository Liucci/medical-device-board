from datetime import datetime, timezone

from supabase import Client

from password_reset.verify_password_reset_token import verify_password_reset_token
from password_reset.create_password_reset_token import password_reset_tokens
from password_reset.fetch_password_reset_code import fetch_password_reset_code


# パスワード変更ページ初期化時に呼び出す処理
def init_password_reset_page_transaction(
    client: Client,
    reset_token: str,
    code: str
):
    print("fetch_password_reset_email_transaction")

    # reset_tokenの有効性確認
    is_valid = verify_password_reset_token(reset_token=reset_token)
    if not is_valid:
        return None

    # reset_tokenに紐づくメールアドレスを取得
    reset_token_data = password_reset_tokens.get(reset_token)
    if not reset_token_data:
        return None

    token_email = reset_token_data["email"]

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
    if password_reset_code["email"] != token_email:
        return None

    return {
        "email": password_reset_code["email"]
    }