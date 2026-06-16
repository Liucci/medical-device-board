import os

from invites.create_invite_code import create_invite_code
from invites.send_invite_mail import send_invite_mail

from schemas.invite_schemas import (
    CreateInviteCodeRequest,
    SendInviteMailRequest
)
#招待メールを送るところまで
def create_invite_code_transaction(
                                    invite:CreateInviteCodeRequest,
                                    hospital_id:str,
                                    created_by:str
                                  ):

    invite_code = create_invite_code(
                                        invite=invite,
                                        hospital_id=hospital_id,
                                        created_by=created_by
                                     )

    invite_url = (
                    f"{os.getenv('FRONTEND_URL')}"
                    f"/register?code="
                    f"{invite_code['code']}"
                 )

    send_invite_mail(
                        SendInviteMailRequest(
                                                email=invite.email,
                                                invite_url=invite_url
                                             )
                    )

    return invite_code