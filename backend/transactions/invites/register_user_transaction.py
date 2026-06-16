from auth.register_auth_user import register_auth_user
from invites.fetch_invite_code import fetch_invite_code
from invites.update_invite_code import update_invite_code
from users.create_user import create_user
from schemas.invite_schemas import RegisterUserRequest


def register_user_transaction(
                                register:RegisterUserRequest
                             ):

    invite_code = fetch_invite_code(
                                        register.code
                                    )

    if not invite_code:
        raise Exception(
                            "Invalid invite code"
                        )

    if invite_code["used"]:
        raise Exception(
                            "Invite code already used"
                        )

    auth_user = register_auth_user(
                                    email=
                                        invite_code["email"],
                                    password=
                                        register.password
                                  )

    create_user(
                    auth_user_id=
                        auth_user.user.id,

                    hospital_id=
                        invite_code["hospital_id"],

                    email=
                        invite_code["email"],

                    display_name=
                        register.display_name,

                    role=
                        invite_code["role"]
               )

    update_invite_code(
                        invite_code_id=
                            invite_code["id"],
                        used=True
                      )

    return auth_user