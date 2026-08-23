from auth.register_auth_user import register_auth_user
from invites.fetch_invite_code import fetch_invite_code
from invites.update_invite_code import update_invite_code
from hospitals.add_hospital import add_hospital
from users.add_user import add_user
from schemas.invite_schemas import (
                                      RegisterUserRequest,
                                      RegisterUserResponse
                                    )
from schemas.user_schemas import AddUserRequest
from schemas.hospital_schemas import AddHospitalRequest
from supabase import Client
from common.get_auth_client_for_login import get_auth_client_for_login
from hospital_settings.add_hospital_settings import add_hospital_settings
from schemas.hospital_settings_schemas import AddHospitalSettingsRequest

def register_first_admin_transaction(
                                      client:Client,
                                      register: RegisterUserRequest,
                                    ):
    print("register_first_admin_transaction")
    invite_code = fetch_invite_code(
                                      client,
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

    # Auth user登録
    # auth user 登録だけはログイン前の認証処理用client
    auth_client = get_auth_client_for_login()

    new_user = register_auth_user(
        client=auth_client,
        email=invite_code["email"],
        password=register.password
    )
    #hospital登録
    hospital = add_hospital(
                            client, 
                            AddHospitalRequest(
                                      hospital_name=invite_code["hospital_name"],
                                      price_plan="free",
                                      note=None
                            )
    )   

    # hospital settings登録
    add_hospital_settings(
                        client=client,
                        hospital_settings=
                          AddHospitalSettingsRequest(
                                                      hospital_id=hospital["id"],
                                                      show_patient_name=False,
                                                      auto_logout_enabled=False,
                                                      auto_logout_time=None,
        )
    )
 #user 登録
    add_user(
            client, 
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
                        client=client, 
                        invite_code_id=invite_code["id"],
                        used=True
                      )
    
    return (
              RegisterUserResponse(
                                    email=invite_code["email"],
                                    role="admin",
                                    hospital_name=hospital["hospital_name"],
                                    display_name=register.display_name
              )
              
    )