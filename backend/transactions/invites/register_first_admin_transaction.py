from auth.register_auth_user import register_auth_user
from invites.fetch_invite_code import fetch_invite_code
from invites.update_invite_code import update_invite_code
from hospitals.add_hospital import add_hospital
from users.add_users import add_user
from schemas.invite_schemas import (
                                      RegisterUserRequest,
                                      RegisterUserResponse
                                    )
from schemas.user_schemas import AddUserRequest
from schemas.hospital_schemas import AddHospitalRequest
def register_first_admin_transaction(
                                      register: RegisterUserRequest
                                    ):
    print("register_first_admin_transaction")
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
    #auth user 登録
    new_user = register_auth_user(
                                    email=invite_code["email"],
                                    password=register.password
                                 )
    #hospital登録
    hospital = add_hospital(
                    AddHospitalRequest(
                              hospital_name=invite_code["hospital_name"],
                              price_plan="free",
                              note=None
                    )
    )   
 #user 登録
    add_user(
              AddUserRequest(
                              id=new_user.user.id,
                              hospital_id=hospital["id"],
                              email=invite_code["email"],
                              display_name=register.display_name,
                              role="admin",
                              is_active=True
                            )
            )
  #invite code使用済み登録
    update_invite_code(
                        invite_code_id=invite_code["id"],
                        used=True
                      )
    
    return RegisterUserResponse(
                                  display_name=register.display_name,
                                  email=invite_code["email"],
                                  role="admin",
                                  hospital_name=hospital["hospital_name"]
                               )