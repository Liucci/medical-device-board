from auth.register_auth_user import register_auth_user
from invites.fetch_invite_code import fetch_invite_code
from invites.update_invite_code import update_invite_code
from users.add_users import add_user
from schemas.invite_schemas import (RegisterUserRequest,RegisterUserResponse)
from schemas.user_schemas import AddUserRequest
from hospitals.fetch_hospital import fetch_hospital
from auth.fetch_current_user import fetch_current_user

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

    if invite_code.get("used") is True:        
        raise Exception(
                            "Invite code already used"
                        )
    #紹介者の情報を取得する
    #invite_code tableの「create by」のuuidを利用
    inviter_user = fetch_current_user(
                                        invite_code["created_by"]
                                      )
    inviter_role = inviter_user["role"]
    print("inviter_role =", inviter_role)

    #new userを登録する作業
    new_user = register_auth_user(
                                    email=invite_code["email"],
                                    password=register.password
                                  )
    new_user_role = invite_code["role"]
    print("new_user_role =", new_user_role)
    add_user(
            AddUserRequest(
                            id=new_user.user.id,
                            hospital_id=invite_code["hospital_id"],
                            email=invite_code["email"],
                            display_name=register.display_name,
                            role=new_user_role,
                            is_active=True
            )
    )
    update_invite_code(
                        invite_code_id=
                            invite_code["id"],
                        used=True
                      )
    print(
      "hospital_id =",
      invite_code["hospital_id"]
     )
    hospital = fetch_hospital(
                                invite_code["hospital_id"]
                            )

    return RegisterUserResponse(
                                display_name=register.display_name,
                                role=invite_code["role"],
                                hospital_name=hospital["hospital_name"]
                                )