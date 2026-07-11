from auth.register_auth_user import register_auth_user
from invites.fetch_invite_code import fetch_invite_code
from invites.update_invite_code import update_invite_code
from users.add_user import add_user
from schemas.invite_schemas import (RegisterUserRequest,RegisterUserResponse)
from schemas.user_schemas import AddUserRequest
from hospitals.fetch_hospital import fetch_hospital
from auth.fetch_current_user import fetch_current_user

def register_user_transaction(
                                register:RegisterUserRequest
                             ):
    print("register_user_transaction")

    #invite code取得
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

    #auth userを登録する作業
    new_user = register_auth_user(
                                    email=invite_code["email"],
                                    password=register.password
                                    )
    
    #user登録                             
    add_user(
            AddUserRequest(
                            id=new_user.user.id,
                            hospital_id=invite_code["hospital_id"],
                            email=invite_code["email"],
                            display_name=register.display_name,
                            role=invite_code["role"],
                            is_active=True
            )
    )
    #紹介コード使用済み登録
    update_invite_code(
                        invite_code_id=
                            invite_code["id"],
                        used=True
                      )
    #hospital nameを取得するためにfetch hospital実行
    hospital = fetch_hospital(
                                invite_code["hospital_id"]
                            )

    return RegisterUserResponse(
                                display_name=register.display_name,
                                email=invite_code["email"],
                                role=invite_code["role"],
                                hospital_name=hospital["hospital_name"]
                                )