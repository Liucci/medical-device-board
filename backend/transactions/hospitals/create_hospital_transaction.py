from hospitals.add_hospital import add_hospital
from invites.create_invite_code import create_invite_code
from schemas.hospital_schemas import CreateHospitalRequest
from schemas.invite_schemas import CreateInviteCodeRequest
from invites.send_invite_mail import send_invite_mail


def create_hospital_transaction(
                                  request: CreateHospitalRequest,
                                  current_user_id: str
                                ):

    hospital = add_hospital(
                              hospital_name=request.hospital_name
                            )

    invite = CreateInviteCodeRequest(
                                      email=request.email,
                                      role="admin"
                                    )

    invite_code = create_invite_code(
                                      invite=invite,
                                      hospital_id=hospital["id"],
                                      created_by=current_user_id
                                    )

    send_invite_mail(
                      email=request.email,
                      code=invite_code["code"]
                    )

    return hospital