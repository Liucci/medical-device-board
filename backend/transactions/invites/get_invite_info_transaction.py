from invites.fetch_invite_code import (
    fetch_invite_code
)

from schemas.invite_schemas import (
    InviteInfoResponse
)


def get_invite_info_transaction(
                                  code:str
                               ):
    #該当の紹介コードに紐づいている他の情報をすべて取得する
    invite_code_info = fetch_invite_code(
                                      code
                                   )

    if not invite_code_info:
        raise Exception(
                          "Invalid invite code"
                       )

    if invite_code_info.get("used") is True:
        raise Exception(
                          "Invite code already used"
                       )

    return InviteInfoResponse(
                                email=invite_code_info["email"],
                                role=invite_code_info["role"]
                             )