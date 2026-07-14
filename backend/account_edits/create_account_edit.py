import uuid
from datetime import datetime, timedelta

from common.supabase_client import supabase
from schemas.account_edit_schemas import CreateAccountEditCodeRequest


def create_account_edit_code(
    request: CreateAccountEditCodeRequest
):
    print("create_account_edit_code")

    code = str(uuid.uuid4())

    expires_at = (
        datetime.utcnow()
        + timedelta(minutes=30)
    )

    response = (
        supabase
        .table("account_edit_codes")
        .insert(
            {
                "user_id": request.user_id,
                "code": code,
                "used": False,
                "expires_at": expires_at.isoformat()
            }
        )
        .execute()
    )

    return response.data[0]