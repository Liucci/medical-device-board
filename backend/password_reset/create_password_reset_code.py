import uuid
from datetime import datetime, timedelta, timezone

from supabase import Client


# reset用codeを生成してDB保存
def create_password_reset_code(
    client: Client,
    email: str
):
    print("create_password_reset_code")

    # UUIDを生成
    code = str(uuid.uuid4())

    # 有効期限（30分）
    expires_at = (
        datetime.now(timezone.utc)
        + timedelta(minutes=30)
    )

    response = (
        client
        .table("password_reset_codes")
        .insert({
            "email": email,
            "code": code,
            "used": False,
            "expires_at": expires_at.isoformat()
        })
        .execute()
    )

    return response.data[0]