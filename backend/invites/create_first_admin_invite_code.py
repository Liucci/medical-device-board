import uuid
from datetime import datetime,timedelta
from common.supabase_client import supabase
from schemas.invite_schemas import CreateInviteCodeRequest


def create_first_admin_invite_code(
                                    invite: CreateInviteCodeRequest,
                                    hospital_name: str,
                                    created_by: str
                                  ):
    print("create_first_admin_invite_code")
    code = str(uuid.uuid4())

    expires_at = (
                    datetime.utcnow()
                    + timedelta(days=7)
                 )

    response = (
                  supabase
                  .table("invite_codes")
                  .insert(
                            {
                              "code": code,
                              "hospital_name": hospital_name,
                              "created_by": created_by,
                              "email": invite.email,
                              "role": "admin",
                              "used": False,
                              "expires_at": expires_at.isoformat()
                            }
                          )
                  .execute()
               )

    return response.data[0]