from fastapi import FastAPI, HTTPException, Header, Depends, Response,Request,Cookie
from fastapi.middleware.cors import (CORSMiddleware)
from pydantic import BaseModel
import os

from auth.login import (login_user)
from auth.fetch_current_user import (fetch_current_user)
from auth.get_auth_user_id import (get_auth_user_id)
from auth.refresh_token import (refresh_token)
from auth.check_user_active import check_user_active
from auth.check_permission import check_permission

from schemas.auth_schemas import RefreshTokenRequest
from schemas.invite_schemas import (CreateInviteCodeRequest)
from schemas.invite_schemas import (RegisterUserRequest)

#from schemas.hospital_schemas import CreateHospitalRequest
from schemas.invite_schemas import InviteFirstAdminRequest

from transactions.invites.invite_first_admin_transaction import invite_first_admin_transaction
from transactions.invites.register_first_admin_transaction import register_first_admin_transaction
                                                                                                                                   

from transactions.invites.register_user_transaction import (register_user_transaction)
from transactions.auth.fetch_current_user_transaction import fetch_current_user_transaction

from transactions.tasks.complete_maintenance_task_transaction import complete_maintenance_task_transaction
from transactions.tasks.update_maintenance_task_due_at_transaction import update_maintenance_task_due_at_transaction
from transactions.tasks.cancel_maintenance_task_transaction import cancel_maintenance_task_transaction


from transactions.invites.create_invite_code_transaction import (create_invite_code_transaction)
from transactions.invites.get_invite_info_transaction import (get_invite_info_transaction)

from devices.fetch_devices import (fetch_devices)
from devices.add_device import (add_device)
from devices.fetch_stock_last_updated import fetch_stock_last_updated
from devices.fetch_ward_last_updated import fetch_ward_last_updated
from stock_areas.fetch_stock_areas import (fetch_stock_areas)
from wards.fetch_wards import (fetch_wards)
from rooms.fetch_rooms import (fetch_rooms)
from users.fetch_users import (fetch_users)
from hospitals.fetch_hospital import fetch_hospital

from device_types.fetch_device_type import (fetch_device_types )
from device_models.fetch_device_models import (fetch_device_models)
from maintenance_types.fetch_maintenance_types import fetch_maintenance_types

from tasks.fetch_maintenance_tasks_by_device_id import (fetch_maintenance_tasks_by_device_id)
from tasks.fetch_maintenance_tasks import (fetch_maintenance_tasks)
from histories.fetch_histories import (fetch_device_histories)
from maintenance_types.fetch_maintenance_types import (fetch_maintenance_types)

from schemas.device_schemas import (
                                        AddDeviceRequest,
                                        DeleteDeviceRequest,
                                        UpdateManagementNumberRequest,
                                        UpdateSerialNumberRequest,
                                        UpdateNoteRequest,
                                        UpdateMaintenanceDatesRequest,
                                        StartMaintenanceRequest,
                                        FinishMaintenanceRequest,
                                        StartStandbyRequest,
                                        FinishStandbyRequest,
                                        MoveDeviceRequest,
                                        UpdateDeviceRentalDatesRequest
                                    )
from schemas.stock_area_schemas import (AddStockAreaRequest,DeleteStockAreasRequest,UpdateStockAreaRequest,UpdateStockAreaOrdersRequest)
from schemas.ward_schemas import (AddWardRequest,WardResponse,DeleteWardRequest,UpdateWardRequest,UpdateWardOrdersRequest,)
from schemas.room_schemas import (AddRoomRequest,UpdateRoomRequest,UpdateRoomPatientRequest,DeleteRoomsRequest,ClearRoomPatientRequest)
from schemas.device_type_schemas import (AddDeviceTypeRequest,DeleteDeviceTypeRequest, UpdateDeviceTypeRequest)
from schemas.device_model_schemas import (AddDeviceModelRequest,DeviceModelsResponse,DeleteDeviceModelsRequest, UpdateDeviceModelRequest)
from schemas.maintenance_type_schemas import (AddMaintenanceTypeRequest, UpdateMaintenanceTypeRequest, DeleteMaintenanceTypesRequest)
from schemas.maintenance_task_schemas import CompleteMaintenanceTaskRequest
from schemas.maintenance_task_schemas import (UpdateMaintenanceTaskDueAtRequest,CancelMaintenanceTaskRequest)
from schemas.ward_infection_schemas import (
                                            WardInfectionResponse,
                                            AddWardInfectionRequest,
                                            DeleteWardInfectionsRequest,
                                            UpdateWardInfectionsRequest,
                                        )

from transactions.fetch_init_dashboard import (fetch_init_dashboard)

from transactions.devices.create_device_transaction import (create_device_transaction)
from transactions.devices.delete_device_transaction import ( delete_device_transaction ) 
from transactions.devices.update_management_number_transaction import (update_management_number_transaction)
from transactions.devices.update_serial_number_transaction import (update_serial_number_transaction)
from transactions.devices.update_note_transaction import (update_note_transaction)
from transactions.devices.update_device_rental_dates_transaction import (update_device_rental_dates_transaction)
from transactions.devices.update_maintenance_dates_transaction import (update_maintenance_dates_transaction)

from transactions.devices.start_maintenance_transaction import (start_maintenance_transaction)
from transactions.devices.finish_maintenance_transaction import (finish_maintenance_transaction)
from transactions.devices.start_standby_transaction import (start_standby_transaction)
from transactions.devices.finish_standby_transaction import (finish_standby_transaction)
from transactions.devices.move_stock_to_room_transaction import (move_stock_to_room_transaction)
from transactions.devices.move_stock_to_stock_transaction import move_stock_to_stock_transaction
from transactions.devices.move_room_to_stock_transaction import move_room_to_stock_transaction
from transactions.devices.move_room_to_room_transaction import move_room_to_room_transaction
from transactions.devices.move_room_to_room_new_patient_transaction import move_room_to_room_new_patient_transaction

from transactions.stock_areas.create_stock_area_transaction import create_stock_area_transaction
from transactions.stock_areas.delete_stock_area_transaction import delete_stock_area_transaction
from transactions.stock_areas.update_stock_area_transaction import (update_stock_area_transaction)
from transactions.stock_areas.update_stock_area_display_order_transaction import (update_stock_area_display_order_transaction)

from transactions.wards.create_ward_transaction import (create_ward_transaction)
from transactions.wards.delete_ward_transaction import (delete_ward_transaction)
from transactions.wards.update_ward_transaction import (update_ward_transaction)
from transactions.wards.update_ward_display_order_transaction import (update_ward_display_order_transaction)

from transactions.rooms.create_room_transaction import (create_room_transaction)
from transactions.rooms.update_room_transaction import (update_room_transaction,update_room_patientname_transaction)
from transactions.rooms.delete_rooms_transaction import delete_room_transaction

from transactions.device_types.create_device_type_transaction import (create_device_type_transaction)
from transactions.device_types.delete_device_type_transaction import (delete_device_type_transaction)
from transactions.device_types.update_device_type_transaction import update_device_type_transaction
from transactions.device_models.create_device_model_transaction import (create_device_model_transaction)
from transactions.device_models.update_device_model_transaction import update_device_model_transaction
from transactions.device_models.delete_device_models_transaction import delete_device_models_transaction
from transactions.device_models.update_device_model_transaction import update_device_model_transaction

from transactions.maintenance_types.create_maintenance_type_transaction import create_maintenance_type_transaction
from transactions.maintenance_types.update_maintenance_type_transaction import update_maintenance_type_transaction
from transactions.maintenance_types.delete_maintenance_type_transaction import delete_maintenance_type_transaction

from schemas.ward_schemas import UpdateWardInfoRequest
from transactions.wards.update_ward_info_transaction import (update_ward_info_transaction,)
#exports
from schemas.export_schemas import  ExportHistoryPdfRequest
from transactions.exports.export_history_pdf_transaction import export_history_pdf_transaction
from fastapi.responses import StreamingResponse
from schemas.export_schemas import ExportHistoryPdfRequest
from transactions.exports.export_history_pdf_transaction import (export_history_pdf_transaction)
from schemas.export_schemas import (DeviceListExportSchemaRequest)
from transactions.exports.export_device_list_pdf_transaction import (export_device_list_pdf_transaction)
from transactions.exports.export_device_list_csv_transaction import (export_device_list_csv_transaction)
from transactions.exports.export_history_csv_transaction import (export_history_csv_transaction)

from schemas.infection_type_schemas import (
                                            InfectionTypeResponse,
                                            AddInfectionTypeRequest,
                                            UpdateInfectionTypeRequest,
                                            DeleteInfectionTypesRequest,)
 
from schemas.room_infection_schemas import (
                                            RoomInfectionResponse,
                                                AddRoomInfectionRequest,
                                                DeleteRoomInfectionsRequest
                                            )

from infection_types.fetch_infection_types import fetch_infection_types
from room_infections.fetch_room_infections import fetch_room_infections
from ward_infections.fetch_ward_infections import fetch_ward_infections

from transactions.infection_types.create_infection_type_transaction import create_infection_type_transaction
from transactions.infection_types.update_infection_type_transaction import update_infection_type_transaction
from transactions.infection_types.delete_infection_types_transaction import delete_infection_types_transaction

from transactions.room_infections.create_room_infection_transaction import create_room_infection_transaction
from transactions.room_infections.delete_room_infections_transaction import delete_room_infections_transaction

from schemas.room_infection_schemas import UpdateRoomInfectionsRequest
from transactions.room_infections.update_room_infections_transaction import update_room_infections_transaction
from transactions.ward_infections.create_ward_infection_transaction import (create_ward_infection_transaction)
from transactions.ward_infections.delete_ward_infections_transaction import (delete_ward_infections_transaction)
from transactions.ward_infections.update_ward_infections_transaction import (update_ward_infections_transaction)

#運営用
from transactions.hospitals.fetch_hospital_management_transaction import (fetch_hospital_management_transaction)
from transactions.user_management.fetch_user_management_transaction import (fetch_user_management_transaction)

from schemas.hospital_schemas import (AddHospitalRequest,UpdateHospitalRequest)
from hospitals.add_hospital import add_hospital
from hospitals.update_hospital import update_hospital
from schemas.user_schemas import UpdateUserRequest
from users.update_user import update_user
from transactions.user_management.update_user_transaction import update_user_transaction

#useraccount編集用
from schemas.account_edit_schemas import (
                                                CreateAccountEditCodeRequest,
                                                UpdateMyAccountRequest,
                                                VerifyAccountEditCodeRequest
                                              )

from transactions.account_edits.create_account_edit_transaction import (create_account_edit_code_transaction)
from transactions.account_edits.verify_account_edit_transaction import (verify_account_edit_code_transaction)
from transactions.account_edits.update_my_account_transaction import (update_my_account_transaction)


#announce用
from schemas.announcement_schemas import (
                                            AddAnnouncementRequest,
                                            UpdateAnnouncementRequest
                                        )
from transactions.announcements.create_announcement_transaction import (create_announcement_transaction)
from transactions.announcements.update_announcement_transaction import (update_announcement_transaction)
from transactions.announcements.fetch_announcements_transaction import (fetch_announcements_transaction)
from schemas.announcement_schemas import FetchActiveAnnouncementsRequest
from transactions.announcements.fetch_active_announcements_transaction import fetch_active_announcements_transaction

#hospital setting用
from schemas.hospital_settings_schemas import (UpdateHospitalSettingsRequest)
from transactions.hospital_settings.fetch_hospital_settings_transaction import (fetch_hospital_settings_transaction)
from transactions.hospital_settings.update_hospital_settings_transaction import (update_hospital_settings_transaction)

from common.supabase_admin_provider import get_admin_client
from common.supabase_auth_provider import get_auth_client

#session
from session.session_provider import create_session,get_session,delete_session
from auth.session import get_current_session
from schemas.session_schemas import BackendSession



from dotenv import load_dotenv
load_dotenv()


app = FastAPI()
#originを指定してCORSを許可する
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://devix.jp",
         "https://www.devix.jp",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoginRequest(BaseModel):
                                email: str
                                password: str
                                


#frontからemailとpasswordを受け取りloginさせる。その際にtoken発行し、
#emailと紐づいているauth_user_idからuser情報を取得する
@app.post("/login")
def login(
            body: LoginRequest,
            request: Request,
            response: Response,
):
        # 既存のBackend Sessionを削除
    old_session_id = request.cookies.get("session_id")

    if old_session_id:
        delete_session(old_session_id)
        response.delete_cookie(
                                key="session_id",
                                path="/",
        )
    auth_response  = login_user(
                            email=body.email,
                            password=body.password
                        )
    auth_user_id = (auth_response .user.id)
    client = get_auth_client(
                            auth_response .session.access_token
                            )
    check_user_active(client,auth_user_id)
    current_user = fetch_current_user_transaction(
                                                client,
                                                auth_user_id
                                                )

    # Backend Session作成
    backend_session = BackendSession(
        user_id=current_user.id,
        hospital_id=current_user.hospital_id,
        hospital_name=current_user.hospital_name,
        #price_plan=current_user.price_plan,
        role=current_user.role,
        email=current_user.email,
        display_name=current_user.display_name,
        access_token=auth_response.session.access_token,
        refresh_token=auth_response.session.refresh_token,
        client=client,  # 追加
    )
    session_id = create_session(backend_session)

   # Session IDをHttpOnly Cookieへ保存
    response.set_cookie(
        key="session_id",
        value=session_id,
        httponly=True,
        secure=False,       # localhostではFalse
        samesite="lax",
        path="/",
    )
    #print("session_id =", session_id)
    #print("session =", get_session(session_id))
    return {
                "success": True,
                "current_user":current_user,
                "access_token": auth_response.session.access_token,
            }

@app.get("/current-user")
def get_current_user(
    session: BackendSession = Depends(get_current_session),
):
    return {
        "id": session.user_id,
        "email": session.email,
        "display_name": session.display_name,
        "role": session.role,
        "hospital_id": session.hospital_id,
        "hospital_name": session.hospital_name,
        "access_token": session.access_token,
    }



#リロード時にcurrent user情報を再取得することでlogin状態が維持される
#旧access token取得方法
"""
@app.get("/current-user")
def get_current_user(
                    auth_user_id: str = Depends(get_auth_user_id),
                    authorization: str = Header(...),
                     ):
    access_token = authorization.removeprefix("Bearer ").strip()
    client = get_auth_client(access_token)

    if not auth_user_id:
        return None
    
    #return fetch_current_user(auth_user_id)
    #hospital nameが内包しているfetch_current_user_transactionを使用
    return fetch_current_user_transaction(client,
                                          auth_user_id)
"""


@app.post("/refresh-token")
def refresh_token_route(
    session_id: str | None = Cookie(default=None),
):
    print("refresh_token_route")

    if not session_id:
        raise HTTPException(
            status_code=401,
            detail="Session not found"
        )

    try:
        response = refresh_token(
            session_id
        )

        return {
            "access_token":
                response.session.access_token,
        }

    except Exception as e:
        print("refresh failed", e)

        raise HTTPException(
            status_code=401,
            detail=str(e)
        )


#招待用コードを作成し、メールを送信する
@app.post("/create-invite-code")
def create_invite_code_route(
    invite: CreateInviteCodeRequest,
    session: BackendSession = Depends(get_current_session),
):
    print("create_invite_code")

    check_permission(
        current_user=session,
        allowed_roles=["admin"],
    )

    return create_invite_code_transaction(
        client=session.client,
        invite=invite,
        hospital_id=session.hospital_id,
        created_by=session.user_id,
    )


#招待pageで招待者の情報を表示
@app.get("/invite-info/{code}")
def get_invite_info_route(
                            code:str,
                         ):
    client = get_admin_client()

    return get_invite_info_transaction(
                                        client,
                                        code
                                        )

#招待したユーザーをDB登録する
@app.post("/register")
def register(
                register:RegisterUserRequest,
            ):
    client = get_admin_client()

    return register_user_transaction(
                                    client,
                                    register,
                                    )

#first admin userをDB登録する
@app.post("/register-first-admin")
def register_first_admin_route(
                                register: RegisterUserRequest,
                              ):
    client = get_admin_client()

    return register_first_admin_transaction(
                                            client,
                                            register,
                                           )




@app.post("/invite-first-admin")
def invite_first_admin_route(
                            request: InviteFirstAdminRequest,
                            session: BackendSession = Depends(get_current_session),
                            ):


    check_permission(
                        current_user=session,
                        allowed_roles=["system_admin"]
                    )

    return invite_first_admin_transaction(
                                            client=session.client,
                                            request=request,
                                            current_user_id=session.user_id,
                                         )

#リロードの際に必要なデータをDBからまとめて取得するAPI
#sessionから必要情報取得
@app.get("/init-dashboard")
def init_dashboard(
    session: BackendSession = Depends(get_current_session),
):
    #client = get_auth_client(session.access_token)
    #sessionから直接clientを取得
    client = session.client
    return fetch_init_dashboard(
        client=client,
        hospital_id=session.hospital_id,
    )

"""
#必要情報をDBから取得
#リロードの際に必要なデータをDBからまとめて取得するAPI
@app.get("/init-dashboard")
def init_dashboard(
                    auth_user_id: str = Depends(get_auth_user_id),
                    authorization: str = Header(...),
):
    access_token = authorization.removeprefix("Bearer ").strip()
    client = get_auth_client(access_token)
    current_user = fetch_current_user_transaction(
                                                client,
                                                auth_user_id
                                                )
    return fetch_init_dashboard(
                                client=client,
                                hospital_id=current_user.hospital_id,
                                )
"""
                                
#全患者情報取得
@app.get("/users")
def get_users():
    client = get_admin_client()
    response = fetch_users(client=client)
    return response


@app.get("/devices")
def get_devices(
    session: BackendSession = Depends(get_current_session),
):
    return fetch_devices(
                        client=session.client,
                        hospital_id=session.hospital_id,
    )

#機器アイコンの新規登録用のAPI
@app.post("/create-device-transaction")
def create_device_transaction_route(
                                    body: AddDeviceRequest,
                                    session: BackendSession = Depends(get_current_session),
                                   ):
    check_permission(
                        current_user=session,
                        allowed_roles=["admin"]
                    )
    create_device_transaction(
                            client=session.client,
                            device=body,
                            hospital_id=session.hospital_id,
                            user_id=session.user_id,
                            status="stock",
                            action_type="create",
                            message="機器を新規登録"
                          )

#機器アイコンを削除するAPI
@app.post("/delete-device-transaction")
def delete_device_transaction_route(
                                        body: DeleteDeviceRequest,
                                        session: BackendSession = Depends(get_current_session),
                                   ):
    
    check_permission(
                        current_user=session,
                        allowed_roles=["admin"]
                    )

    delete_device_transaction(
                            client=session.client,
                            device=body,
                            hospital_id=session.hospital_id,
                            user_id=session.user_id,
                            action_type="delete",
                            message="機器を削除"
                         )    


@app.get("/stock-areas")
def get_stock_areas(
                    session: BackendSession = Depends(get_current_session),
):

    stock_areas = fetch_stock_areas(
                                    client=session.client,
                                    hospital_id=session.hospital_id
                                    )
    return stock_areas

@app.get("/wards")
def get_wards(
                    session: BackendSession = Depends(get_current_session),
):

    
    wards = fetch_wards(
                        client=session.client, 
                        hospital_id=session.hospital_id
                        )
    return wards

@app.post("/wards")
def create_ward_route(
                        ward: AddWardRequest,
                        session: BackendSession = Depends(get_current_session),
                     ):
    
    check_permission(
                        current_user=session,
                        allowed_roles=["admin"]
                    )

    create_ward_transaction(
                            client=session.client, 
                            ward=ward,
                            hospital_id=session.hospital_id
                            )

@app.post("/delete-ward")
def delete_ward_route(
                        ward: DeleteWardRequest,
                        session: BackendSession = Depends(get_current_session),
                     ):

    check_permission(
                        current_user=session,
                        allowed_roles=["admin"]
                    )

    delete_ward_transaction(
                                client=session.client,
                                ward=ward,
                                hospital_id=session.hospital_id
                            )

@app.post("/update-ward")
def update_ward_route(
                        ward: UpdateWardRequest,
                        session: BackendSession = Depends(get_current_session),
                     ):

    check_permission(
                        current_user=session,
                        allowed_roles=["admin"]
                    )
    update_ward_transaction(
                                client=session.client, 
                                ward=ward,
                                hospital_id=session.hospital_id
                            )
    
@app.post("/update-ward-display-order")
def update_ward_display_order_route(
                                    wards: UpdateWardOrdersRequest,
                                    session: BackendSession = Depends(get_current_session),
):


    check_permission(
                        current_user=session,
                        allowed_roles=["admin"]
                    )
    update_ward_display_order_transaction(
                                        client=session.client, 
                                        wards=wards,
                                        hospital_id=session.hospital_id
                                        )

    return {
        "success": True
    }    


@app.get("/rooms")
def get_rooms(
                session: BackendSession = Depends(get_current_session),
                ):

    rooms = fetch_rooms(
                        client=session.client,
                        hospital_id=session.hospital_id
                        )
    return rooms

@app.post("/rooms")
def create_room_route(
                        room:AddRoomRequest,
                        session: BackendSession = Depends(get_current_session),
                     ):
    check_permission(
                        current_user=session,
                        allowed_roles=["admin"]
                    )


    create_room_transaction(
                                client=session.client, 
                                room=room,
                                hospital_id=session.hospital_id
                            )

@app.post("/update-room")
def update_room_route(
                        room: UpdateRoomRequest,
                        session: BackendSession = Depends(get_current_session),
):
    check_permission(
                        current_user=session,
                        allowed_roles=["admin"]
                    )


    update_room_transaction(
                            client=session.client,
                            room=room,
                            hospital_id=session.hospital_id
                            )


@app.post("/update-room-patientname")
def update_room_patientname_route(
                                    room: UpdateRoomPatientRequest,
                                    session: BackendSession = Depends(get_current_session),
                                    ):    
    check_permission(
                        current_user=session,
                        allowed_roles=["admin","normal"]
                    )


    update_room_patientname_transaction(
                                        client=session.client, 
                                        room=room,
                                        hospital_id=session.hospital_id,
                                        user_id=session.user_id
                                    )


@app.post("/update-device-type")
def update_device_type_route(
                                device_type: UpdateDeviceTypeRequest,
                                session: BackendSession = Depends(get_current_session),
                            ):
    check_permission(
                        current_user=session,
                        allowed_roles=["admin"]
                    )
    update_device_type_transaction(
                                    session.client, 
                                    device_type,
                                    session.hospital_id
                                    )


@app.post("/delete-rooms-transaction")
def delete_rooms_transaction_route(
                                    room: DeleteRoomsRequest,
                                    session: BackendSession = Depends(get_current_session),
                                    ):
    check_permission(
                        current_user=session,
                        allowed_roles=["admin"]
                    )
    delete_room_transaction(
                              client=session.client, 
                              room=room,
                              hospital_id=session.hospital_id
                           )

@app.get("/device-types")
def get_device_types(
                    session: BackendSession = Depends(get_current_session),
                    ):

    return fetch_device_types(
                            session.client,
                            session.hospital_id
                            )

@app.post("/device-types")
def create_device_type_route(
                            device_type: AddDeviceTypeRequest,
                            session: BackendSession = Depends(get_current_session),
                            ):
    check_permission(
                        current_user=session,
                        allowed_roles=["admin"]
                    )


    create_device_type_transaction(
                                    session.client, 
                                    device_type,
                                    hospital_id=session.hospital_id
                                    )

@app.post("/delete-device-type")
def delete_device_type_route(
                                device_type:DeleteDeviceTypeRequest,
                                session: BackendSession = Depends(get_current_session),
):

    check_permission(
                        current_user=session,
                        allowed_roles=["admin"]
                    )


    delete_device_type_transaction(
                                    session.client, 
                                    device_type,
                                    hospital_id=session.hospital_id
                                  )

@app.get("/device-models")
def get_device_models(
                        session: BackendSession = Depends(get_current_session),
                      ):
    return fetch_device_models(
                                client=session.client,
                                hospital_id=session.hospital_id
                                )

@app.post("/device-models")
def create_device_model(
                            device_model: AddDeviceModelRequest,
                            session: BackendSession = Depends(get_current_session),
):
    check_permission(
                        current_user=session,
                        allowed_roles=["admin"]
                    )

    create_device_model_transaction(
                                    session.client,
                                    device_model,
                                    session.hospital_id
                                    )

@app.post("/delete-device-models")
def delete_device_models_route(
                                device_model: DeleteDeviceModelsRequest,
                                session: BackendSession = Depends(get_current_session),
                              ):

    check_permission(
                        current_user=session,
                        allowed_roles=["admin"]
                    )
    delete_device_models_transaction(
                                    session.client,
                                    device_model,
                                    session.hospital_id
                                    )

@app.post("/update-device-model")
def update_device_model_route(
                                device_model: UpdateDeviceModelRequest,
                                session: BackendSession = Depends(get_current_session),

                              ):
    check_permission(
                        current_user=session,
                        allowed_roles=["admin"]
                    )


    update_device_model_transaction(
                                    session.client,
                                    device_model,
                                    session.hospital_id
                                    )

@app.get("/tasks")
def get_tasks(
            session: BackendSession = Depends(get_current_session),
    ):

    tasks = fetch_maintenance_tasks(
                                    client=session.client, 
                                    hospital_id=session.hospital_id
                                    )

    return tasks

@app.post("/update-maintenance-task-due-at")
def update_maintenance_task_due_at_route(
                                        task: UpdateMaintenanceTaskDueAtRequest,
                                        session: BackendSession = Depends(get_current_session),
                                        ):

    check_permission(
                        current_user=session,
                        allowed_roles=["admin","normal"]
                    )

    return update_maintenance_task_due_at_transaction(
                                                        client=session.client, 
                                                        task=task,
                                                        hospital_id=session.hospital_id,
                                                        user_id=session.user_id,
                                                        action_type="update",
                                                        message="メンテナンス期限を変更"
                                                    )

@app.post("/cancel-maintenance-task")
def cancel_maintenance_task_route(
                                    task: CancelMaintenanceTaskRequest,
                                    session: BackendSession = Depends(get_current_session),
                                    ):

    check_permission(
                        current_user=session,
                        allowed_roles=["admin","normal"]
                    )
    return cancel_maintenance_task_transaction(
                                                client=session.client, 
                                                task=task,
                                                hospital_id=session.hospital_id,
                                                user_id=session.user_id,
                                                action_type="update",
                                                message="メンテナンスタスクを中止"
                                            )


@app.get("/maintenance-types")
def get_maintenance_types(
                        session: BackendSession = Depends(get_current_session),
    ):


    return fetch_maintenance_types(
                                    session.client, 
                                    session.hospital_id
                                    )

@app.post("/maintenance-types")
def create_maintenance_type_route(
                                maintenance_type: AddMaintenanceTypeRequest, 
                                session: BackendSession = Depends(get_current_session),
    ):
    check_permission(
                        current_user=session,
                        allowed_roles=["admin"]
                    )

    return create_maintenance_type_transaction(
                                                session.client, 
                                                maintenance_type,
                                                session.hospital_id,
                                                session.user_id
                                          )

@app.post("/update-maintenance-type")
def update_maintenance_type_route(
                                maintenance_type: UpdateMaintenanceTypeRequest, 
                                session: BackendSession = Depends(get_current_session),
            ):
    check_permission(
                        current_user=session,
                        allowed_roles=["admin"]
                    )
    return update_maintenance_type_transaction(
                                                session.client, 
                                                maintenance_type,
                                                session.hospital_id
                                              )


@app.post("/delete-maintenance-types")
def delete_maintenance_types_route(
                        maintenance_types: DeleteMaintenanceTypesRequest,
                        session: BackendSession = Depends(get_current_session),
    ):


    check_permission(
                        current_user=session,
                        allowed_roles=["admin"]
                    )

    return delete_maintenance_type_transaction(
                                                session.client, 
                                                maintenance_types,
                                                session.hospital_id
                                              )
@app.get("/histories")
def get_histories(
                session: BackendSession = Depends(get_current_session),
                  ):
    histories = fetch_device_histories(
                                client=session.client,
                                hospital_id=session.hospital_id
                               )
    return histories


#stock_area追加用API
@app.post("/create-stock-area-transaction")
def create_stock_area_transaction_route(
                                        stock_area: AddStockAreaRequest,
                                        session: BackendSession = Depends(get_current_session),
                                        ):
    check_permission(
                        current_user=session,
                        allowed_roles=["admin"]
                    )

    response = create_stock_area_transaction(
                                                client=session.client, 
                                                stock_area=stock_area,
                                                hospital_id=session.hospital_id
                                             )
    return response

@app.post("/delete-stock-area-transaction")
def delete_stock_area_transaction_route(
                                        stock_area: DeleteStockAreasRequest,
                                    session: BackendSession = Depends(get_current_session),
                                        ):
    check_permission(
                        current_user=session,
                        allowed_roles=["admin"]
                    )

    delete_stock_area_transaction(
                                    client=session.client,
                                    stock_area=stock_area,
                                    hospital_id=session.hospital_id
                                 )

@app.post("/update-stock-area-transaction")
def update_stock_area_transaction_route(
                                        stock_area: UpdateStockAreaRequest,
                                        session: BackendSession = Depends(get_current_session),
                                        ):

    check_permission(
                        current_user=session,
                        allowed_roles=["admin"]
                    )
    update_stock_area_transaction(
                                    client=session.client, 
                                    stock_area=stock_area,
                                    hospital_id=session.hospital_id
                                    )

@app.get("/infection-types")
def get_infection_types(
                        session: BackendSession = Depends(get_current_session),
                       ):

    return fetch_infection_types(
                                session.client,
                                session.hospital_id
                                )


@app.post("/infection-types")
def create_infection_type_route(
                                infection_type: AddInfectionTypeRequest,
                                session: BackendSession = Depends(get_current_session),
                               ):

    check_permission(
                        current_user=session,
                        allowed_roles=["admin"]
                    )

    create_infection_type_transaction(
                                        session.client,
                                        infection_type,
                                        session.hospital_id
                                     )


@app.post("/update-infection-type")
def update_infection_type_route(
                                    infection_type: UpdateInfectionTypeRequest,
                                    session: BackendSession = Depends(get_current_session),
                               ):


    check_permission(
                        current_user=session,
                        allowed_roles=["admin"]
                    )


    update_infection_type_transaction(
                                        session.client,
                                        infection_type,
                                        session.hospital_id
                                     )


@app.post("/delete-infection-types")
def delete_infection_types_route(
                                    infection_type: DeleteInfectionTypesRequest,
                                    session: BackendSession = Depends(get_current_session),
                                ):

    check_permission(
                        current_user=session,
                        allowed_roles=["admin"]
                    )


    delete_infection_types_transaction(
                                        session.client,
                                        infection_type,
                                        session.hospital_id
                                      )


@app.get("/room-infections")
def get_room_infections(
                                    session: BackendSession = Depends(get_current_session),
                       ):
    return fetch_room_infections(
                                session.client,
                                session.hospital_id
                                 )


@app.post("/room-infections")
def create_room_infection_route(
                                room_infection: AddRoomInfectionRequest,
                                    session: BackendSession = Depends(get_current_session),
                               ):


    check_permission(
                        current_user=session,
                        allowed_roles=["admin","normal"]
                    )
    create_room_infection_transaction(
                                        session.client,
                                        room_infection,
                                        session.hospital_id
                                     )


@app.post("/delete-room-infections")
def delete_room_infections_route(
                                    room_infection: DeleteRoomInfectionsRequest,
                                    session: BackendSession = Depends(get_current_session),
                                ):




    check_permission(
                        current_user=session,
                        allowed_roles=["admin","normal"]
                    )


    delete_room_infections_transaction(
                                        session.client, 
                                        room_infection,
                                        session.hospital_id
                                      )

@app.post("/update-room-infections-transaction")
def update_room_infections_route(
                    room_infection: UpdateRoomInfectionsRequest,
                    session: BackendSession = Depends(get_current_session),
):
    check_permission(
                        current_user=session,
                        allowed_roles=["admin","normal"]
                    )

    
    return update_room_infections_transaction(
                                              session.client, 
                                              room_infection, 
                                              session.hospital_id
                                              )

@app.post("/update-stock-area-display-order")
def update_stock_area_display_order_route(
                                            stock_areas: UpdateStockAreaOrdersRequest,
                                    session: BackendSession = Depends(get_current_session),
                                        ):

    check_permission(
                        current_user=session,
                        allowed_roles=["admin"]
                    )


    update_stock_area_display_order_transaction(
                                            client=session.client,
                                            stock_areas=stock_areas,
                                            hospital_id=session.hospital_id
                                        )

    return {
        "success": True
    }


@app.post("/update-management-number")
def update_management_number_route(
                                     body: UpdateManagementNumberRequest,
                                    session: BackendSession = Depends(get_current_session),
                                   ):

    check_permission(
                        current_user=session,
                        allowed_roles=["admin","normal"]
                    )


    update_management_number_transaction(
                                            client=session.client,
                                            device=body,
                                            hospital_id=session.hospital_id,
                                            user_id=session.user_id,
                                            action_type="update",
                                            message="管理番号を更新"
                                         )

@app.post("/update-serial-number")
def update_serial_number_route(
                                 body: UpdateSerialNumberRequest,
                                    session: BackendSession = Depends(get_current_session),
                               
                               ):

    check_permission(
                        current_user=session,
                        allowed_roles=["admin","normal"]
                    )


    update_serial_number_transaction(
                                        client=session.client,  
                                        device=body,
                                        hospital_id=session.hospital_id,
                                        user_id=session.user_id,
                                        action_type="update",
                                        message="シリアル番号を更新"
                                     )

@app.post("/update-note")
def update_note_route(
                        body: UpdateNoteRequest,
                        session: BackendSession = Depends(get_current_session),
                      ):

    check_permission(
                        current_user=session,
                        allowed_roles=["admin","normal"]
                    )


    update_note_transaction(
                              client=session.client,  
                              device=body,
                              hospital_id=session.hospital_id,
                              user_id=session.user_id,
                              action_type="update",
                              message="備考を更新"
                           )

@app.post("/update-device-rental-dates")
def update_device_rental_dates_route(
                                    device: UpdateDeviceRentalDatesRequest,
                                    session: BackendSession = Depends(get_current_session),
                                    ):


    check_permission(
                        current_user=session,
                        allowed_roles=["admin","normal"]
                    )

    update_device_rental_dates_transaction(
                                            client=session.client,      
                                            device=device,
                                            hospital_id=session.hospital_id,
                                            user_id=session.user_id
                                           )

@app.post("/update-maintenance-dates")
def update_maintenance_dates_route(
                                      device: UpdateMaintenanceDatesRequest,
                                    session: BackendSession = Depends(get_current_session),
                                  ):

    check_permission(
                        current_user=session,
                        allowed_roles=["admin","normal"]
                    )

    return update_maintenance_dates_transaction(
                                                client=session.client,
                                                device=device,
                                                hospital_id=session.hospital_id,
                                                user_id=session.user_id,
                                                action_type="update",
                                                message="保守開始日変更"
                                                )

@app.post("/start-maintenance")
def start_maintenance_route(
                            body: StartMaintenanceRequest,
                            session: BackendSession = Depends(get_current_session),

                            ):


    check_permission(
                        current_user=session,
                        allowed_roles=["admin","normal"]
                    )


    start_maintenance_transaction(
                                    client=session.client, 
                                    device=body,
                                    hospital_id=session.hospital_id,
                                    user_id=session.user_id,
                                    action_type="update",
                                    message="保守開始"
                                 )

@app.post("/finish-maintenance")
def finish_maintenance_route(
                            body: FinishMaintenanceRequest,
                            session: BackendSession = Depends(get_current_session),
                             ):

    check_permission(
                        current_user=session,
                        allowed_roles=["admin","normal"]
                    )


    finish_maintenance_transaction(
                                     client=session.client, 
                                     device=body,
                                     hospital_id=session.hospital_id,
                                     user_id=session.user_id,
                                     action_type="update",
                                     message="保守終了"
                                  )

@app.post("/start-standby")
def start_standby_route(
                        body: StartStandbyRequest,
                        session: BackendSession = Depends(get_current_session),
                        ):

    check_permission(
                        current_user=session,
                        allowed_roles=["admin","normal"]
                    )


    start_standby_transaction(
                                client=session.client, 
                                device=body,
                                hospital_id=session.hospital_id,
                                user_id=session.user_id,
                                action_type="update",
                                message="スタンバイ開始"
                             )

@app.post("/finish-standby")
def finish_standby_route(
                        body: FinishStandbyRequest,
                        session: BackendSession = Depends(get_current_session),
                         ):


    check_permission(
                        current_user=session,
                        allowed_roles=["admin","normal"]
                    )


    finish_standby_transaction(
                                 client=session.client, 
                                 device=body,
                                 hospital_id=session.hospital_id,
                                 user_id=session.user_id,
                                 action_type="update",
                                 message="スタンバイ終了"
                              )

@app.post("/move_stock_to_room")
def move_stock_to_room_route(
                            device: MoveDeviceRequest,
                            room: UpdateRoomPatientRequest,
                            session: BackendSession = Depends(get_current_session),
                           ):


    check_permission(
                        current_user=session,
                        allowed_roles=["admin","normal"]
                    )
    moved_device = move_stock_to_room_transaction(
                                                    client=session.client, 
                                                    device=device,
                                                    room=room,
                                                    hospital_id=session.hospital_id,
                                                    user_id=session.user_id,
                                                    status="room",
                                                    action_type="move",
                                                    message="stock to room"
                                                  )

    return moved_device


@app.post("/move_stock_to_stock")
def move_stock_to_stock_route(
                                device: MoveDeviceRequest,
                                session: BackendSession = Depends(get_current_session),
                             ):

    check_permission(
                        current_user=session,
                        allowed_roles=["admin","normal"]
                    )
    moved_device = move_stock_to_stock_transaction(
                                                    client=session.client, 
                                                    device=device,
                                                    hospital_id=session.hospital_id,
                                                    user_id=session.user_id,
                                                    status="stock",
                                                    action_type="move",
                                                    message="stock to stock"
                                                  )

    return moved_device

@app.post("/move_room_to_stock")
def move_room_to_stock_route(
                            device: MoveDeviceRequest,
                            room: ClearRoomPatientRequest,
                            session: BackendSession = Depends(get_current_session),
                            ):


    check_permission(
                        current_user=session,
                        allowed_roles=["admin","normal"]
                    )

    moved_device = move_room_to_stock_transaction(
                                                    client=session.client, 
                                                    device=device,
                                                    room=room,
                                                    hospital_id=session.hospital_id,
                                                    user_id=session.user_id,
                                                    patient_name=None,
                                                    status="stock",
                                                    action_type="move",
                                                    message="room to stock"
                                                  )

    return moved_device

@app.post("/move_room_to_room")
def move_room_to_room_route(
                        device: MoveDeviceRequest,
                        pre_room: ClearRoomPatientRequest,
                        post_room: UpdateRoomPatientRequest,
                        session: BackendSession = Depends(get_current_session),
                    ):
    check_permission(
                        current_user=session,
                        allowed_roles=["admin","normal"]
                    )

    moved_device=move_room_to_room_transaction(
                                            client=session.client, 
                                            device=device,
                                            pre_room=pre_room,
                                            post_room=post_room,
                                            hospital_id=session.hospital_id,
                                            user_id=session.user_id,
                                            pre_patient_name=None,
                                            status="room",
                                            action_type="move",
                                            message="room to room"
                                         )
    return moved_device

@app.post("/move_room_to_room_new_patient")
def move_room_to_room_new_patient_route(
                                        device: MoveDeviceRequest,
                                        pre_room: ClearRoomPatientRequest,
                                        post_room: UpdateRoomPatientRequest,
                                        session: BackendSession = Depends(get_current_session),
                                       ):


    check_permission(
                        current_user=session,
                        allowed_roles=["admin","normal"]
                    )

    moved_device = move_room_to_room_new_patient_transaction(
                                                              client=session.client,  
                                                              device=device,
                                                              pre_room=pre_room,
                                                              post_room=post_room,
                                                              hospital_id=session.hospital_id,
                                                              user_id=session.user_id,
                                                              pre_patient_name=None,
                                                              management_number=None,
                                                              serial_number=None,
                                                              note=None,
                                                              status="room",
                                                              action_type="move",
                                                              message="room to room new patient"
                                                            )

    return moved_device

@app.get("/stock-last-updated")
def fetch_stock_last_updated_route(
                                    session: BackendSession = Depends(get_current_session),
                                    ):

    stock_updated_at=fetch_stock_last_updated(
                                            client=session.client,
                                            hospital_id=session.hospital_id
                                            )

    
    return {
        "updated_at": stock_updated_at,
    }

@app.get("/ward-last-updated")
def fetch_ward_last_updated_route(
                                    session: BackendSession = Depends(get_current_session),
                                    ):

    ward_updated_at=fetch_ward_last_updated(
                                            client=session.client,
                                            hospital_id=session.hospital_id
                                            )
    
    return {
        "updated_at": ward_updated_at,
    }



@app.post("/complete_maintenance_task")
def complete_maintenance_task_api(
                                    task: CompleteMaintenanceTaskRequest,
                                    session: BackendSession = Depends(get_current_session),
                                 ):

    check_permission(
                        current_user=session,
                        allowed_roles=["admin","normal"]
                    )


    return complete_maintenance_task_transaction(
                                                    client=session.client, 
                                                    task=task,
                                                    hospital_id=session.hospital_id,
                                                    user_id=session.user_id,
                                                    action_type="update",
                                                    message="maintenance task completed"
                                                )

@app.post("/export-history-pdf")
async def export_history_pdf_route(
                        request: ExportHistoryPdfRequest,
                        session: BackendSession = Depends(get_current_session),
):
    hospital = fetch_hospital(
                            session.client,
                            session.hospital_id
                            )
    hospital_name = hospital["hospital_name"]
    check_permission(
                        current_user=session,
                        allowed_roles=["admin","normal"]
                    )
    # debug
    pdf_buffer = export_history_pdf_transaction(
                                                request.rows,
                                                hospital_name,
                                                show_patient_name=request.show_patient_name
                                                )

    return StreamingResponse(
                            pdf_buffer,
                            media_type="application/pdf",
                            headers={
                                    "Content-Disposition":
                                    "attachment; filename=histories.pdf"
                            }
    )

@app.post("/export-device-list-pdf")
async def export_device_list_pdf_route(
                                        request: DeviceListExportSchemaRequest,
                                        session: BackendSession = Depends(get_current_session),
):
    hospital = fetch_hospital(
                            session.client,
                            session.hospital_id
                            )
    hospital_name = hospital["hospital_name"]
    check_permission(
                        current_user=session,
                        allowed_roles=["admin","normal"]
                    )

    pdf_buffer = export_device_list_pdf_transaction(
                                                
                                                    request.rows,
                                                    hospital_name,
                                                    show_patient_name=request.show_patient_name
                                                   )

    return StreamingResponse(
                                pdf_buffer,
                                media_type="application/pdf",
                                headers={
                                            "Content-Disposition":
                                            "attachment; filename=device_list.pdf"
                                        }
                            )


@app.post("/export-device-list-csv")
def export_device_list_csv_route(
                                request: DeviceListExportSchemaRequest,
                                session: BackendSession = Depends(get_current_session),
):
    check_permission(
                        current_user=session,
                        allowed_roles=["admin","normal"]
                    )

    csv_buffer = export_device_list_csv_transaction(
                                                    request.rows,
                                                    show_patient_name=request.show_patient_name
                                                    )
    return StreamingResponse(
                            csv_buffer,
                            media_type="text/csv",
                            headers={
                                "Content-Disposition":"attachment; filename=device_list.csv"
                            }
    )

@app.post("/export-history-csv")
def export_history_csv_route(
                            request: ExportHistoryPdfRequest,
                            session: BackendSession = Depends(get_current_session),
):
    check_permission(
                        current_user=session,
                        allowed_roles=["admin","normal"]
                    )

    csv_buffer = export_history_csv_transaction(
                                                request.rows,
                                                show_patient_name=request.show_patient_name
                                                )

    return StreamingResponse(
                            csv_buffer,
                            media_type="text/csv",
                            headers={
                                "Content-Disposition":
                                "attachment; filename=histories.csv"
                            }
    )

#病院一覧取得
@app.get("/fetch-hospital-management")
def fetch_hospital_management_route(
                                    session: BackendSession = Depends(get_current_session),
    ):
    check_permission(
                        current_user=session,
                        allowed_roles=["system_admin"]
                    )
    client = get_admin_client()
    return fetch_hospital_management_transaction(client)

@app.post("/create-hospital")
def create_hospital(
                        request: AddHospitalRequest,
                        session: BackendSession = Depends(get_current_session),
                        ):
    # System Adminのみ許可
    check_permission(
                        current_user=session,
                        allowed_roles=["system_admin"]
                    )
    client = get_admin_client()

    add_hospital(client=client, 
                 hospital=request)

    return {
        "success": True
    }



@app.post("/update-hospital")
def update_hospital_route(
                            request: UpdateHospitalRequest,
                            session: BackendSession = Depends(get_current_session),
                        ):
    check_permission(
                        current_user=session,
                        allowed_roles=["system_admin"]
                    )
    client = get_admin_client()

    update_hospital(client, 
                    hospital=request)

    return {
        "message": "Hospital updated successfully"
    }

#ユーザー一覧取得
@app.get("/fetch-user-management")
def fetch_user_management_route(
                        #auth_user_id: str = Depends(get_auth_user_id),
                        #authorization: str = Header(...),
                        session: BackendSession = Depends(get_current_session),

    ):

    #access_token = authorization.removeprefix("Bearer ").strip()
    client = get_admin_client()
    #current_user = fetch_current_user_transaction(client,auth_user_id)
    check_permission(
                        current_user=session,
                        allowed_roles=["system_admin"]
                    )

    return fetch_user_management_transaction(client)


#role,is activeを編集可能
@app.post("/update-user")
def update_user_route(
                    request: UpdateUserRequest,
                    session: BackendSession = Depends(get_current_session),
):
    print("role =", session.role)
    check_permission(
                        current_user=session,
                        allowed_roles=["system_admin"]
                    )
    #service keyでDBアクセスできるclient
    client = get_admin_client()

    update_user_transaction(
        client = client,
        request=request,
        auth_user_id=session.user_id
    )


#アカウント情報編集用コード送信用
@app.post("/create-account-edit-code")
def create_account_edit_code(
                            session: BackendSession = Depends(get_current_session),
    ):

    return create_account_edit_code_transaction(session.client, 
                                                request=CreateAccountEditCodeRequest(
                                                                    user_id=session.user_id,
                                                                    email=session.email                                                        
                                                                    ),
                                                )
#codeの有効性を判定し、有効なcodeならuser情報を返す
@app.post("/verify-account-edit-code")
def verify_account_edit_code(
                                request: VerifyAccountEditCodeRequest,
                                session: BackendSession = Depends(get_current_session),
                            ):

    account_edit_code = verify_account_edit_code_transaction(
                                                            session.client, 
                                                            code=request.code
                                                            )

    user = fetch_current_user_transaction(
                                session.client, 
                                auth_user_id=account_edit_code["user_id"]
                             )
    return user


@app.post("/update-my-account")
def update_my_account(
                        request: UpdateMyAccountRequest,
                        session: BackendSession = Depends(get_current_session),

                    ):

    update_my_account_transaction(
                                session.client, 
                                request,
                                  )
    # Backend Sessionにも反映
    session.display_name = request.display_name
    return {"message": "success"}


#一覧取得
@app.get("/fetch-announcements")
def fetch_announcements_route(
                            session: BackendSession = Depends(get_current_session),
    ):
    check_permission(
                    current_user=session,
                    allowed_roles=["system_admin"]
    )
    return fetch_announcements_transaction(session.client, )

#announce新規作成
@app.post("/create-announcement")
def create_announcement_route(
                            request: AddAnnouncementRequest,
                            session: BackendSession = Depends(get_current_session),
):
    check_permission(
                    current_user=session,
                    allowed_roles=["system_admin"]
    )

    return create_announcement_transaction(session.client, 
                                           request)

#annouce編集更新
@app.post("/update-announcement")
def update_announcement_route(
                                request: UpdateAnnouncementRequest,
                                session: BackendSession = Depends(get_current_session),
):
    check_permission(
                    current_user=session,
                    allowed_roles=["system_admin"]
    )

    return update_announcement_transaction(session.client, 
                                           request)


#dashboardお知らせ表示用
@app.post("/fetch-active-announcements")
def fetch_active_announcements_route(
                                    request: FetchActiveAnnouncementsRequest,
                                    session: BackendSession = Depends(get_current_session),
                                    ):
    return fetch_active_announcements_transaction(
                                                    session.client, 
                                                    request
                                                )
#hospital-settings
@app.get("/hospital-settings")
def get_hospital_settings(
                        session: BackendSession = Depends(get_current_session),
                         ):
    print("role =", session.role)
    print("hospital_id =", session.hospital_id)
    return fetch_hospital_settings_transaction(
                                                session.client, 
                                                session.hospital_id
                                              )

@app.post("/update-hospital-settings")
def update_hospital_settings_route(
                                        hospital_settings: UpdateHospitalSettingsRequest,
                                        session: BackendSession = Depends(get_current_session),
                                  ):
    check_permission(
                        current_user=session,
                        allowed_roles=["admin"]
                    )
    return update_hospital_settings_transaction(
                                                    session.client, 
                                                    hospital_settings,
                                                    session.hospital_id
                                               )

@app.get("/ward-infections")
def get_ward_infections(
                        session: BackendSession = Depends(get_current_session),
):


    return fetch_ward_infections(
                                    session.client, 
                                    session.hospital_id
                                )

@app.post("/ward-infections")
def create_ward_infection_route(
                                ward_infection: AddWardInfectionRequest,
                                session: BackendSession = Depends(get_current_session),
):

    check_permission(
                    current_user=session,
                    allowed_roles=["admin", "normal"]
    )

    return create_ward_infection_transaction(
                                            session.client, 
                                            ward_infection,
                                            session.hospital_id
    )

@app.post("/delete-ward-infections")
def delete_ward_infections_route(
                        ward_infection: DeleteWardInfectionsRequest,
                        session: BackendSession = Depends(get_current_session),
):


    check_permission(
        current_user=session,
        allowed_roles=["admin", "normal"]
    )

    delete_ward_infections_transaction(
                                        session.client, 
                                        ward_infection,
                                        session.hospital_id
    )

@app.post("/update-ward-infections-transaction")
def update_ward_infections_route(
                                        ward_infection: UpdateWardInfectionsRequest,
                                        session: BackendSession = Depends(get_current_session),
):

    check_permission(
                        current_user=session,
                        allowed_roles=["admin", "normal"]
                    )

    return update_ward_infections_transaction(
                                            session.client, 
                                            ward_infection,
                                            session.hospital_id
    )

@app.post("/update-ward-info")
def update_ward_info(
                        ward: UpdateWardInfoRequest,
                        session: BackendSession = Depends(get_current_session),
):

    return update_ward_info_transaction(
                                        client=session.client, 
                                        ward=ward,
                                        hospital_id=session.hospital_id,
    )