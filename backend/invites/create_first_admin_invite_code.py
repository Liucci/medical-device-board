import uuid
from datetime import datetime,timedelta
from common.supabase_admin_client import supabase
from supabase import Client
from schemas.invite_schemas import CreateInviteCodeRequest


def create_first_admin_invite_code(
                                    client:Client,
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
                  client
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