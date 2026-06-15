import os
from invites.create_invite_code import create_invite_code
from invites.send_invite_mail import send_invite_mail
from schemas.invite_schemas import (CreateInviteCodeRequest,SendInviteMailRequest)

def create_invite_code_transaction(
                                    invite:CreateInviteCodeRequest,
                                    hospital_id: str,
                                    created_by: str,
                                    frontend_url: str
                                  ):

    invite_code = create_invite_code(
                                       invite=invite,
                                        hospital_id=hospital_id,
                                        created_by=created_by,
                                    )
    frontend_url = os.getenv("FRONTEND_URL")
    invite_url = (
                    f"{frontend_url}"
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