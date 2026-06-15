import uuid
from datetime import datetime,timedelta
from common.supabase_client import (supabase)

def create_invite_code(
                        email: str,
                        role: str,
                        hospital_id: str,
                        created_by: str
                      ):
#uuidを送る
    code = str(uuid.uuid4())
#招待コードの期限は７日間
    expires_at = (datetime.utcnow()+ timedelta(days=7))

    response = (
                supabase
                .table("invite_codes")
                .insert({
                        "code": code,
                        "hospital_id": hospital_id,
                        "created_by": created_by,
                        "email": email,
                        "role": role,
                        "used": False,
                        "expires_at": expires_at.isoformat()
                        })
                .execute()
                )

    return response.data