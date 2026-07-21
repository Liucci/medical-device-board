import os

from invites.create_first_admin_invite_code import create_first_admin_invite_code
from invites.send_invite_mail import send_invite_mail

from schemas.invite_schemas import (
                                      CreateInviteCodeRequest,
                                      SendInviteMailRequest,
                                      InviteFirstAdminRequest
                                    )


def invite_first_admin_transaction(
                                    request: InviteFirstAdminRequest,
                                    current_user_id: str
                                  ):
    print("invite_first_admin_transaction")

    invite = CreateInviteCodeRequest(
                                      email=request.email,
                                      role="admin"
                                    )

    invite_code = create_first_admin_invite_code(
                                      invite=invite,
                                      hospital_name=request.hospital_name,
                                      created_by=current_user_id
                                    )

    invite_url = (
                    f"{os.getenv('FRONTEND_URL')}"
                    f"/first-admin-register?code="
                    f"{invite_code['code']}"
                )

    send_invite_mail(
                      SendInviteMailRequest(
                                              email=request.email,
                                              expires_at=invite_code["expires_at"]
                                            ),
                                            invite_url=invite_url
                    )

    return invite_code


