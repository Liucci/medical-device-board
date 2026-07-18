from fastapi import FastAPI,Depends
from fastapi import HTTPException

from fastapi.middleware.cors import (CORSMiddleware)
from fastapi import Header
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

#exports
from schemas.export_schemas import  ExportHistoryPdfRequest
from transactions.exports.export_history_pdf_transaction import export_history_pdf_transaction
from fastapi.responses import StreamingResponse
from fastapi import Request
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

from transactions.infection_types.create_infection_type_transaction import create_infection_type_transaction
from transactions.infection_types.update_infection_type_transaction import update_infection_type_transaction
from transactions.infection_types.delete_infection_types_transaction import delete_infection_types_transaction

from transactions.room_infections.create_room_infection_transaction import create_room_infection_transaction
from transactions.room_infections.delete_room_infections_transaction import delete_room_infections_transaction

from schemas.room_infection_schemas import UpdateRoomInfectionsRequest
from transactions.room_infections.update_room_infections_transaction import update_room_infections_transaction


#運営用
from transactions.hospitals.fetch_hospital_management_transaction import (fetch_hospital_management_transaction)
from transactions.user_management.fetch_user_management_transaction import (fetch_user_management_transaction)

from schemas.hospital_schemas import (AddHospitalRequest,UpdateHospitalRequest)
from hospitals.add_hospital import add_hospital
from hospitals.update_hospital import update_hospital
from schemas.user_schemas import UpdateUserRequest
from users.update_user import update_user
from transactions.user_management.update_user_transaction import update_user_transaction

from schemas.account_edit_schemas import (
                                                CreateAccountEditCodeRequest,
                                                UpdateMyAccountRequest,
                                                VerifyAccountEditCodeRequest
                                              )

from transactions.account_edits.create_account_edit_transaction import (create_account_edit_code_transaction)
from transactions.account_edits.verify_account_edit_transaction import (verify_account_edit_code_transaction)
from transactions.account_edits.update_my_account_transaction import (update_my_account_transaction)

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
def login(body: LoginRequest):
    response = login_user(
                            email=body.email,
                            password=body.password
                        )
    auth_user_id = (response.user.id)
    check_user_active(auth_user_id)
    current_user = (fetch_current_user(auth_user_id))
    return {
                "success": True,
                "access_token":response.session.access_token,
                "refresh_token":response.session.refresh_token,
                "current_user":current_user
            }


#リロード時にcurrent user情報を再取得することでlogin状態が維持される
@app.get("/current-user")
def get_current_user(auth_user_id: str = Depends(get_auth_user_id)):
    if not auth_user_id:
        return None
    return fetch_current_user(auth_user_id)


@app.post("/refresh-token")
def refresh_token_route(body: RefreshTokenRequest):
    print("refresh_token_route")
    try:
        response = refresh_token(
            body.refresh_token
        )

        print(
            "new refresh token",
            response.session.refresh_token[:20]
        )

        auth_user_id = response.user.id
        current_user = fetch_current_user(auth_user_id)

        return {
            "access_token":
                response.session.access_token,
            "refresh_token":
                response.session.refresh_token,
            "current_user":
                current_user
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
                                auth_user_id: str = Depends(
                                    get_auth_user_id
                                )
                            ):
    print("auth_user_id =", auth_user_id)
    current_user = fetch_current_user(
                                        auth_user_id
                                     )
    check_permission(
                        current_user=current_user,
                        allowed_roles=["admin"]
                    )


    frontend_url = (
        os.getenv("FRONTEND_URL")
        or "http://localhost:3000"
    )

    return create_invite_code_transaction(
                                            invite=invite,
                                            hospital_id=current_user["hospital_id"],
                                            created_by=current_user["id"],
                                         )

@app.get("/invite-info/{code}")
def get_invite_info_route(
                            code:str
                         ):

    return get_invite_info_transaction(code)

#招待したユーザーをDB登録する
@app.post("/register")
def register(
                register:RegisterUserRequest,
            ):
    return register_user_transaction(register,
                                    )

#first admin userをDB登録する
@app.post("/register-first-admin")
def register_first_admin_route(
                                register: RegisterUserRequest,
                              ):

    return register_first_admin_transaction(
                                              register,
                                           )




@app.post("/invite-first-admin")
def invite_first_admin_route(
                              request: InviteFirstAdminRequest,
                              auth_user_id: str = Depends(get_auth_user_id)
                            ):

    current_user = fetch_current_user(auth_user_id)

    check_permission(
                        current_user=current_user,
                        allowed_roles=["system_admin"]
                    )

    return invite_first_admin_transaction(
                                            request=request,
                                            current_user_id=current_user["id"]
                                         )


#リロードの際に必要なデータをDBからまとめて取得するAPI
@app.get("/init-dashboard")
def init_dashboard(
                    auth_user_id: str = Depends(get_auth_user_id)
                    ):

    current_user = (fetch_current_user(auth_user_id))

    return fetch_init_dashboard(
                                    hospital_id=
                                        current_user[
                                            "hospital_id"
                                        ]
                                )


@app.get("/users")
def get_users():
    response = fetch_users()
    print("===== users =====")
    print(response)
    return response

@app.get("/devices")
def get_devices(auth_user_id: str = Depends(get_auth_user_id)):
    current_user = (fetch_current_user(auth_user_id))
    devices = (
                fetch_devices(
                                hospital_id=
                                current_user["hospital_id"]
                )
    )
    return devices

#機器アイコンの新規登録用のAPI
@app.post("/create-device-transaction")
def create_device_transaction_route(
                                    body: AddDeviceRequest,
                                    auth_user_id: str = Depends(get_auth_user_id)
                                   ):
    print("auth_user_id =", auth_user_id)
    current_user = fetch_current_user(auth_user_id)

    check_permission(
                        current_user=current_user,
                        allowed_roles=["admin"]
                    )

    create_device_transaction(
                            device=body,
                            hospital_id=current_user["hospital_id"],
                            user_id=current_user["id"],
                            status="stock",
                            action_type="create",
                            message="機器を新規登録"
                          )

#機器アイコンを削除するAPI
@app.post("/delete-device-transaction")
def delete_device_transaction_route(
                                        body: DeleteDeviceRequest,
                                        auth_user_id: str = Depends(get_auth_user_id)
                                   ):
    current_user = fetch_current_user(auth_user_id)
    print("current_user")

    check_permission(
                        current_user=current_user,
                        allowed_roles=["admin"]
                    )

    delete_device_transaction(
                            device=body,
                            hospital_id=current_user["hospital_id"],
                            user_id=current_user["id"],
                            action_type="delete",
                            message="機器を削除"
                         )    





@app.get("/stock-areas")
def get_stock_areas(auth_user_id: str = Depends(get_auth_user_id)):
    current_user = (
        fetch_current_user(
            auth_user_id
        )
    )

    stock_areas = (
        fetch_stock_areas(

            hospital_id=
            current_user[
                "hospital_id"
            ]
        )
    )

    return stock_areas

@app.get("/wards")
def get_wards(auth_user_id: str = Depends(get_auth_user_id)):
    current_user = (fetch_current_user(auth_user_id))
    wards = (fetch_wards(
                        hospital_id=
                        current_user["hospital_id"]
                        )
    )

    return wards

@app.post("/wards")
def create_ward_route(
                        ward: AddWardRequest,
                        auth_user_id: str = Depends(get_auth_user_id)
                     ):
    current_user = (fetch_current_user(auth_user_id))
    check_permission(
                        current_user=current_user,
                        allowed_roles=["admin"]
                    )

    create_ward_transaction(
                                ward=ward,
                                hospital_id=current_user["hospital_id"]
                                )

@app.post("/delete-ward")
def delete_ward_route(
                        ward: DeleteWardRequest,
                        auth_user_id: str = Depends(get_auth_user_id)
                     ):

    current_user = fetch_current_user(auth_user_id)
    check_permission(
                        current_user=current_user,
                        allowed_roles=["admin"]
                    )

    delete_ward_transaction(
                                ward=ward,
                                hospital_id=current_user["hospital_id"]
                            )

@app.post("/update-ward")
def update_ward_route(
                        ward: UpdateWardRequest,
                        auth_user_id: str = Depends(get_auth_user_id)
                     ):

    current_user = fetch_current_user(auth_user_id)

    print(current_user)
    check_permission(
                        current_user=current_user,
                        allowed_roles=["admin"]
                    )


    update_ward_transaction(
                                ward=ward,
                                hospital_id=current_user["hospital_id"]
                            )
@app.post("/update-ward-display-order")
def update_ward_display_order_route(
                                    wards: UpdateWardOrdersRequest,
                                    auth_user_id: str = Depends(get_auth_user_id)
                                    ):

    current_user = fetch_current_user(auth_user_id)
    print(current_user)

    check_permission(
                        current_user=current_user,
                        allowed_roles=["admin"]
                    )


    update_ward_display_order_transaction(
                                        wards=wards,
                                        hospital_id=current_user["hospital_id"]
                                        )

    return {
        "success": True
    }    



@app.get("/rooms")
def get_rooms(auth_user_id: str = Depends(get_auth_user_id)):
    current_user = (fetch_current_user(auth_user_id))

    rooms = (fetch_rooms(
        hospital_id=current_user["hospital_id"]
        ))

    return rooms

@app.post("/rooms")
def create_room_route(
                        room:AddRoomRequest,
                        auth_user_id:str = Depends(get_auth_user_id)
                     ):

    current_user = fetch_current_user(auth_user_id)
    check_permission(
                        current_user=current_user,
                        allowed_roles=["admin"]
                    )


    create_room_transaction(
                                room=room,
                                hospital_id=current_user["hospital_id"]
                            )

@app.post("/update-room")
def update_room_route(
                        room: UpdateRoomRequest,
                        auth_user_id: str = Depends(get_auth_user_id)):
    
    current_user = fetch_current_user(auth_user_id)
    check_permission(
                        current_user=current_user,
                        allowed_roles=["admin"]
                    )


    update_room_transaction(
                                     room=room,
                                     hospital_id=current_user["hospital_id"]
                                   )


@app.post("/update-room-patientname")
def update_room_patientname_route(
                                    room: UpdateRoomPatientRequest,
                                    auth_user_id: str = Depends(get_auth_user_id)):
                                  
    current_user = fetch_current_user(auth_user_id)
    check_permission(
                        current_user=current_user,
                        allowed_roles=["admin","normal"]
                    )


    update_room_patientname_transaction(
                                                 room=room,
                                                 hospital_id=current_user["hospital_id"],
                                                 user_id=current_user["id"]
                                               )


@app.post("/update-device-type")
def update_device_type_route(
                                device_type: UpdateDeviceTypeRequest,
                                auth_user_id: str = Depends(get_auth_user_id)
                            ):
    print("update_device_type")
    current_user = fetch_current_user(auth_user_id)
    check_permission(
                        current_user=current_user,
                        allowed_roles=["admin"]
                    )


    update_device_type_transaction(
                                            device_type,
                                            current_user["hospital_id"]
                                          )


@app.post("/delete-rooms-transaction")
def delete_rooms_transaction_route(
                                    room: DeleteRoomsRequest,
                                    auth_user_id: str = Depends(get_auth_user_id)):
                                  
    current_user = fetch_current_user(auth_user_id)
    print("delete room transaction route")
    check_permission(
                        current_user=current_user,
                        allowed_roles=["admin"]
                    )


    delete_room_transaction(
                              room=room,
                              hospital_id=current_user["hospital_id"]
                           )

@app.get("/device-types")
def get_device_types(auth_user_id: str = Depends(get_auth_user_id)):
                                  
    current_user = fetch_current_user(auth_user_id)
    print("get_device_types")

    return fetch_device_types(current_user["hospital_id"])

@app.post("/device-types")
def create_device_type_route(
                                device_type: AddDeviceTypeRequest,
                                auth_user_id: str = Depends(get_auth_user_id)
                            ):
    print("create_device_type_route")
    current_user = fetch_current_user(auth_user_id)
    check_permission(
                        current_user=current_user,
                        allowed_roles=["admin"]
                    )


    create_device_type_transaction(
                                    device_type,
                                    hospital_id=current_user["hospital_id"]
                                    )

@app.post("/delete-device-type")
def delete_device_type_route(
                                device_type:DeleteDeviceTypeRequest,
                                auth_user_id:str = Depends(get_auth_user_id)
                            ):

    current_user = fetch_current_user(auth_user_id)

    print("delete_device_type_route")
    check_permission(
                        current_user=current_user,
                        allowed_roles=["admin"]
                    )


    delete_device_type_transaction(
                                    device_type,
                                    hospital_id=current_user["hospital_id"]
                                  )

@app.get("/device-models")
def get_device_models(auth_user_id: str = Depends(get_auth_user_id)):
    current_user = fetch_current_user(auth_user_id)
    print("get_device_models")

    return fetch_device_models(current_user["hospital_id"])

@app.post("/device-models")
def create_device_model(
                            device_model: AddDeviceModelRequest,
                            auth_user_id: str = Depends(get_auth_user_id)
                        ):

    current_user = fetch_current_user(auth_user_id)
    print("create_device_model")
    check_permission(
                        current_user=current_user,
                        allowed_roles=["admin"]
                    )


    create_device_model_transaction(
                                            device_model,
                                            current_user["hospital_id"]
                                          )

@app.post("/delete-device-models")
def delete_device_models_route(
                                  device_model: DeleteDeviceModelsRequest,
                                  auth_user_id: str = Depends(get_auth_user_id)
                              ):

    current_user = fetch_current_user(auth_user_id)
    print("delete_device_models")
    check_permission(
                        current_user=current_user,
                        allowed_roles=["admin"]
                    )


    delete_device_models_transaction(
                                            device_model,
                                            current_user["hospital_id"]
                                          )

@app.post("/update-device-model")
def update_device_model_route(
                                device_model: UpdateDeviceModelRequest,
                                auth_user_id: str = Depends(get_auth_user_id)
                              ):

    current_user = fetch_current_user(auth_user_id)
    print("update_device_model")
    check_permission(
                        current_user=current_user,
                        allowed_roles=["admin"]
                    )


    update_device_model_transaction(
                                            device_model,
                                            current_user["hospital_id"]
                                          )

@app.get("/tasks")
def get_tasks(auth_user_id: str = Depends(get_auth_user_id)):
    current_user = (fetch_current_user(auth_user_id))



    tasks = (
        fetch_maintenance_tasks(
            hospital_id=
            current_user[
                "hospital_id"
            ]
        )
    )

    return tasks

@app.post("/update-maintenance-task-due-at")
def update_maintenance_task_due_at_route(
                                        task: UpdateMaintenanceTaskDueAtRequest,
                                        auth_user_id = Depends(get_auth_user_id)
                                        ):

    current_user = fetch_current_user(auth_user_id)
    check_permission(
                        current_user=current_user,
                        allowed_roles=["admin","normal"]
                    )

    return update_maintenance_task_due_at_transaction(
                                                        task=task,
                                                        hospital_id=current_user["hospital_id"],
                                                        user_id=current_user["id"],
                                                        action_type="update",
                                                        message="メンテナンス期限を変更"
                                                    )

@app.post("/cancel-maintenance-task")
def cancel_maintenance_task_route(
                                    task: CancelMaintenanceTaskRequest,
                                    auth_user_id = Depends(get_auth_user_id)
                                    ):

    current_user = fetch_current_user(auth_user_id)
    check_permission(
                        current_user=current_user,
                        allowed_roles=["admin","normal"]
                    )
    return cancel_maintenance_task_transaction(
                                                task=task,
                                                hospital_id=current_user["hospital_id"],
                                                user_id=current_user["id"],
                                                action_type="update",
                                                message="メンテナンスタスクを中止"
                                            )


@app.get("/maintenance-types")
def get_maintenance_types(auth_user_id: str = Depends(get_auth_user_id)):

    current_user = fetch_current_user(auth_user_id)



    print("get_maintenance_types")

    return fetch_maintenance_types(current_user["hospital_id"])





@app.post("/maintenance-types")
def create_maintenance_type_route(maintenance_type: AddMaintenanceTypeRequest, auth_user_id: str = Depends(get_auth_user_id)):

    current_user = fetch_current_user(auth_user_id)
    check_permission(
                        current_user=current_user,
                        allowed_roles=["admin"]
                    )

    print("create_maintenance_type")

    return create_maintenance_type_transaction(
                                                maintenance_type,
                                                current_user["hospital_id"],
                                                auth_user_id
                                              )


@app.post("/update-maintenance-type")
def update_maintenance_type_route(maintenance_type: UpdateMaintenanceTypeRequest, auth_user_id: str = Depends(get_auth_user_id)):

    current_user = fetch_current_user(auth_user_id)

    check_permission(
                        current_user=current_user,
                        allowed_roles=["admin"]
                    )


    print("update_maintenance_type")

    return update_maintenance_type_transaction(
                                                maintenance_type,
                                                current_user["hospital_id"]
                                              )


@app.post("/delete-maintenance-types")
def delete_maintenance_types_route(maintenance_types: DeleteMaintenanceTypesRequest, auth_user_id: str = Depends(get_auth_user_id)):

    current_user = fetch_current_user(auth_user_id)

    check_permission(
                        current_user=current_user,
                        allowed_roles=["admin"]
                    )


    print("delete_maintenance_types")

    return delete_maintenance_type_transaction(
                                                maintenance_types,
                                                current_user["hospital_id"]
                                              )
@app.get("/histories")
def get_histories(auth_user_id: str = Depends(get_auth_user_id)):
    current_user = (
        fetch_current_user(
            auth_user_id
        )
    )

  

    histories = (
        fetch_device_histories(

            hospital_id=
            current_user[
                "hospital_id"
            ]
        )
    )

    return histories


#stock_area追加用API
@app.post("/create-stock-area-transaction")
def create_stock_area_transaction_route(
                                          stock_area: AddStockAreaRequest,
                                          auth_user_id: str = Depends(
                                          get_auth_user_id
                                        )
                                        ):
    current_user = (fetch_current_user(auth_user_id))
    hospital_id = current_user["hospital_id"]
    check_permission(
                        current_user=current_user,
                        allowed_roles=["admin"]
                    )

    response = create_stock_area_transaction(
                                                stock_area=stock_area,
                                                hospital_id=hospital_id
                                             )

    return response

@app.post("/delete-stock-area-transaction")
def delete_stock_area_transaction_route(
                                          stock_area: DeleteStockAreasRequest,
                                          auth_user_id: str = Depends(
                                          get_auth_user_id)
                                        ):
    current_user = (fetch_current_user(auth_user_id))
    hospital_id = current_user["hospital_id"]
    check_permission(
                        current_user=current_user,
                        allowed_roles=["admin"]
                    )

    delete_stock_area_transaction(
                                    stock_area=stock_area,
                                    hospital_id=hospital_id
                                 )

@app.post("/update-stock-area-transaction")
def update_stock_area_transaction_route(
                                          stock_area: UpdateStockAreaRequest,
                                          auth_user_id: str = Depends(
                                          get_auth_user_id)
                                        ):

    current_user = fetch_current_user(auth_user_id)
    hospital_id = current_user["hospital_id"]
    check_permission(
                        current_user=current_user,
                        allowed_roles=["admin"]
                    )
    update_stock_area_transaction(
                                    stock_area=stock_area,
                                    hospital_id=hospital_id
                                    )

@app.get("/infection-types")
def get_infection_types(
                            auth_user_id: str = Depends(get_auth_user_id)
                       ):

    current_user = fetch_current_user(auth_user_id)

    print("get_infection_types")

    return fetch_infection_types(current_user["hospital_id"])


@app.post("/infection-types")
def create_infection_type_route(
                                    infection_type: AddInfectionTypeRequest,
                                    auth_user_id: str = Depends(get_auth_user_id)
                               ):

    current_user = fetch_current_user(auth_user_id)

    print("create_infection_type")

    check_permission(
                        current_user=current_user,
                        allowed_roles=["admin"]
                    )


    create_infection_type_transaction(
                                        infection_type,
                                        current_user["hospital_id"]
                                     )


@app.post("/update-infection-type")
def update_infection_type_route(
                                    infection_type: UpdateInfectionTypeRequest,
                                    auth_user_id: str = Depends(get_auth_user_id)
                               ):

    current_user = fetch_current_user(auth_user_id)

    print("update_infection_type")
    check_permission(
                        current_user=current_user,
                        allowed_roles=["admin"]
                    )


    update_infection_type_transaction(
                                        infection_type,
                                        current_user["hospital_id"]
                                     )


@app.post("/delete-infection-types")
def delete_infection_types_route(
                                    infection_type: DeleteInfectionTypesRequest,
                                    auth_user_id: str = Depends(get_auth_user_id)
                                ):

    current_user = fetch_current_user(auth_user_id)

    print("delete_infection_types")

    check_permission(
                        current_user=current_user,
                        allowed_roles=["admin"]
                    )


    delete_infection_types_transaction(
                                        infection_type,
                                        current_user["hospital_id"]
                                      )


@app.get("/room-infections")
def get_room_infections(
                            auth_user_id: str = Depends(get_auth_user_id)
                       ):
    current_user = fetch_current_user(auth_user_id)
    print("get_room_infections")
    return fetch_room_infections(current_user["hospital_id"])


@app.post("/room-infections")
def create_room_infection_route(
                                    room_infection: AddRoomInfectionRequest,
                                    auth_user_id: str = Depends(get_auth_user_id)
                               ):

    current_user = fetch_current_user(auth_user_id)

    print("create_room_infection")
    check_permission(
                        current_user=current_user,
                        allowed_roles=["admin","normal"]
                    )
    create_room_infection_transaction(
                                        room_infection,
                                        current_user["hospital_id"]
                                     )


@app.post("/delete-room-infections")
def delete_room_infections_route(
                                    room_infection: DeleteRoomInfectionsRequest,
                                    auth_user_id: str = Depends(get_auth_user_id)
                                ):

    current_user = fetch_current_user(auth_user_id)

    print("delete_room_infections")

    check_permission(
                        current_user=current_user,
                        allowed_roles=["admin","normal"]
                    )


    delete_room_infections_transaction(
                                        room_infection,
                                        current_user["hospital_id"]
                                      )

@app.post("/update-room-infections-transaction")
def update_room_infections_route(
    room_infection: UpdateRoomInfectionsRequest,
    auth_user_id: str = Depends(get_auth_user_id)
):
    current_user = fetch_current_user(auth_user_id)

    print("update_room_infections_route")
    hospital_id = current_user["hospital_id"]
    check_permission(
                        current_user=current_user,
                        allowed_roles=["admin","normal"]
                    )

    
    return update_room_infections_transaction(room_infection, hospital_id)

@app.post("/update-stock-area-display-order")
def update_stock_area_display_order_route(
                                            stock_areas: UpdateStockAreaOrdersRequest,
                                            auth_user_id: str = Depends(get_auth_user_id)
                                        ):

    current_user = fetch_current_user(auth_user_id)

    print(current_user)
    check_permission(
                        current_user=current_user,
                        allowed_roles=["admin"]
                    )


    update_stock_area_display_order_transaction(
                                            stock_areas=stock_areas,
                                            hospital_id=current_user["hospital_id"]
                                        )

    return {
        "success": True
    }


@app.post("/update-management-number")
def update_management_number_route(
                                     body: UpdateManagementNumberRequest,
                                     auth_user_id: str = Depends(get_auth_user_id)
                                   ):

    current_user = fetch_current_user(auth_user_id)

    check_permission(
                        current_user=current_user,
                        allowed_roles=["admin","normal"]
                    )


    update_management_number_transaction(
                                            device=body,
                                            hospital_id=current_user["hospital_id"],
                                            user_id=current_user["id"],
                                            action_type="update",
                                            message="管理番号を更新"
                                         )

@app.post("/update-serial-number")
def update_serial_number_route(
                                 body: UpdateSerialNumberRequest,
                                 auth_user_id: str = Depends(get_auth_user_id)
                               
                               ):

    current_user = fetch_current_user(auth_user_id)

    check_permission(
                        current_user=current_user,
                        allowed_roles=["admin","normal"]
                    )


    update_serial_number_transaction(
                                        device=body,
                                        hospital_id=current_user["hospital_id"],
                                        user_id=current_user["id"],
                                        action_type="update",
                                        message="シリアル番号を更新"
                                     )

@app.post("/update-note")
def update_note_route(
                        body: UpdateNoteRequest,
                        auth_user_id: str = Depends(get_auth_user_id)
                      ):

    current_user = fetch_current_user(auth_user_id)

    check_permission(
                        current_user=current_user,
                        allowed_roles=["admin","normal"]
                    )


    update_note_transaction(
                              device=body,
                              hospital_id=current_user["hospital_id"],
                              user_id=current_user["id"],
                              action_type="update",
                              message="備考を更新"
                           )

@app.post("/update-device-rental-dates")
def update_device_rental_dates_route(
                                        device: UpdateDeviceRentalDatesRequest,
                                        auth_user_id: str = Depends(get_auth_user_id)
                                    ):

    current_user = fetch_current_user(auth_user_id)
    check_permission(
                        current_user=current_user,
                        allowed_roles=["admin","normal"]
                    )

    update_device_rental_dates_transaction(
                                              device=device,
                                              hospital_id=current_user["hospital_id"],
                                              user_id=current_user["id"]
                                           )

@app.post("/update-maintenance-dates")
def update_maintenance_dates_route(
                                      device: UpdateMaintenanceDatesRequest,
                                      auth_user_id: str = Depends(get_auth_user_id)
                                  ):
    current_user = fetch_current_user(auth_user_id)
    check_permission(
                        current_user=current_user,
                        allowed_roles=["admin","normal"]
                    )

    return update_maintenance_dates_transaction(
                                                device=device,
                                                hospital_id=current_user["hospital_id"],
                                                user_id=current_user["id"],
                                                action_type="maintenance_started_at_updated",
                                                message="保守開始日変更"
                                                )

@app.post("/start-maintenance")
def start_maintenance_route(
                              body: StartMaintenanceRequest,
                              auth_user_id: str = Depends(get_auth_user_id)
                            ):

    current_user = fetch_current_user(auth_user_id)

    check_permission(
                        current_user=current_user,
                        allowed_roles=["admin","normal"]
                    )


    start_maintenance_transaction(
                                    device=body,
                                    hospital_id=current_user["hospital_id"],
                                    user_id=current_user["id"],
                                    action_type="update",
                                    message="保守開始"
                                 )

@app.post("/finish-maintenance")
def finish_maintenance_route(
                               body: FinishMaintenanceRequest,
                               auth_user_id: str = Depends(get_auth_user_id)
                             ):

    current_user = fetch_current_user(auth_user_id)

    check_permission(
                        current_user=current_user,
                        allowed_roles=["admin","normal"]
                    )


    finish_maintenance_transaction(
                                     device=body,
                                     hospital_id=current_user["hospital_id"],
                                     user_id=current_user["id"],
                                     action_type="update",
                                     message="保守終了"
                                  )

@app.post("/start-standby")
def start_standby_route(
                          body: StartStandbyRequest,
                          auth_user_id: str = Depends(get_auth_user_id)
                        ):

    current_user = fetch_current_user(auth_user_id)

    check_permission(
                        current_user=current_user,
                        allowed_roles=["admin","normal"]
                    )


    start_standby_transaction(
                                device=body,
                                hospital_id=current_user["hospital_id"],
                                user_id=current_user["id"],
                                action_type="update",
                                message="スタンバイ開始"
                             )

@app.post("/finish-standby")
def finish_standby_route(
                           body: FinishStandbyRequest,
                           auth_user_id: str = Depends(get_auth_user_id)
                         ):

    current_user = fetch_current_user(auth_user_id)

    check_permission(
                        current_user=current_user,
                        allowed_roles=["admin","normal"]
                    )


    finish_standby_transaction(
                                 device=body,
                                 hospital_id=current_user["hospital_id"],
                                 user_id=current_user["id"],
                                 action_type="update",
                                 message="スタンバイ終了"
                              )





@app.post("/move_stock_to_room")
def move_stock_to_room_route(
                              device: MoveDeviceRequest,
                              room: UpdateRoomPatientRequest,
                              auth_user_id: str = Depends(get_auth_user_id)
                           ):

    current_user = fetch_current_user(auth_user_id)
    print("move_stock_to_room")
    check_permission(
                        current_user=current_user,
                        allowed_roles=["admin","normal"]
                    )
    moved_device = move_stock_to_room_transaction(
                                                    device=device,
                                                    room=room,
                                                    hospital_id=current_user["hospital_id"],
                                                    user_id=current_user["id"],
                                                    status="room",
                                                    action_type="move",
                                                    message="stock to room"
                                                  )

    return moved_device


@app.post("/move_stock_to_stock")
def move_stock_to_stock_route(
                                device: MoveDeviceRequest,
                                auth_user_id: str = Depends(get_auth_user_id)
                             ):

    current_user = fetch_current_user(auth_user_id)
    print("move_stock_to_stock")
    check_permission(
                        current_user=current_user,
                        allowed_roles=["admin","normal"]
                    )
    moved_device = move_stock_to_stock_transaction(
                                                    device=device,
                                                    hospital_id=current_user["hospital_id"],
                                                    user_id=current_user["id"],
                                                    status="stock",
                                                    action_type="move",
                                                    message="stock to stock"
                                                  )

    return moved_device

@app.post("/move_room_to_stock")
def move_room_to_stock_route(
                              device: MoveDeviceRequest,
                              room: ClearRoomPatientRequest,
                              auth_user_id: str = Depends(get_auth_user_id)
                            ):

    current_user = fetch_current_user(auth_user_id)

    print("move_room_to_stock")
    check_permission(
                        current_user=current_user,
                        allowed_roles=["admin","normal"]
                    )

    moved_device = move_room_to_stock_transaction(
                                                    device=device,
                                                    room=room,
                                                    hospital_id=current_user["hospital_id"],
                                                    user_id=current_user["id"],
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
                        auth_user_id: str = Depends(get_auth_user_id)
                    ):

    current_user = fetch_current_user(auth_user_id)
    print("move_room_to_room")
    check_permission(
                        current_user=current_user,
                        allowed_roles=["admin","normal"]
                    )

    moved_device=move_room_to_room_transaction(
                                            device=device,
                                            pre_room=pre_room,
                                            post_room=post_room,
                                            hospital_id=current_user["hospital_id"],
                                            user_id=current_user["id"],
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
                                          auth_user_id: str = Depends(
                                                                      get_auth_user_id
                                                                    )
                                       ):

    current_user = fetch_current_user(auth_user_id)
    print("move_room_to_room_new_patient")
    check_permission(
                        current_user=current_user,
                        allowed_roles=["admin","normal"]
                    )

    moved_device = move_room_to_room_new_patient_transaction(
                                                              device=device,
                                                              pre_room=pre_room,
                                                              post_room=post_room,
                                                              hospital_id=current_user["hospital_id"],
                                                              user_id=current_user["id"],
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
    current_user = Depends(get_current_user)
):

    print("fetch_last_updated_route")

    hospital_id = current_user["hospital_id"]
    stock_updated_at=fetch_stock_last_updated(hospital_id=hospital_id)
    print("stock_updated_at:",stock_updated_at)
    
    return {
        "updated_at": stock_updated_at,
    }

@app.get("/ward-last-updated")
def fetch_ward_last_updated_route(
    current_user = Depends(get_current_user)
):

    print("fetch_ward_last_updated_route")

    hospital_id = current_user["hospital_id"]
    ward_updated_at=fetch_ward_last_updated(hospital_id=hospital_id)
    print("ward_updated_at:",ward_updated_at)
    
    return {
        "updated_at": ward_updated_at,
    }



@app.post("/complete_maintenance_task")
def complete_maintenance_task_api(
                                    task: CompleteMaintenanceTaskRequest,
                                    auth_user_id: str = Depends(get_auth_user_id)
                                 ):
    print("complete_maintenance_task_api")
    current_user = fetch_current_user(auth_user_id)

    check_permission(
                        current_user=current_user,
                        allowed_roles=["admin","normal"]
                    )


    return complete_maintenance_task_transaction(
                                                    task=task,
                                                    hospital_id=current_user["hospital_id"],
                                                    user_id=current_user["id"],
                                                    action_type="update",
                                                    message="maintenance task completed"
                                                )







@app.post("/export-history-pdf")
async def export_history_pdf_route(
                    request: ExportHistoryPdfRequest,
                    auth_user_id: str = Depends(get_auth_user_id)    
):
    print("auth_user_id:", auth_user_id)
    current_user = fetch_current_user(auth_user_id)
    hospital = fetch_hospital(current_user["hospital_id"])
    hospital_name = hospital["hospital_name"]
    check_permission(
                        current_user=current_user,
                        allowed_roles=["admin","normal"]
                    )
    # debug
    """     print("route called")
        print("row count:", len(request.rows))
        if request.rows:
            for key, value in request.rows[0].model_dump().items():
                print(f"・{key}: {value}")
    """
    pdf_buffer = export_history_pdf_transaction(
                                                request.rows,
                                                hospital_name
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
    auth_user_id: str = Depends(get_auth_user_id)
):
    current_user = fetch_current_user(auth_user_id)
    hospital = fetch_hospital(current_user["hospital_id"])
    hospital_name = hospital["hospital_name"]
    check_permission(
                        current_user=current_user,
                        allowed_roles=["admin","normal"]
                    )

    # debug
    # print("route called")
    # print("row count:", len(request.rows))

    # if request.rows:
    #     for key, value in request.rows[0].model_dump().items():
    #         print(f"・{key}: {value}")

    pdf_buffer = export_device_list_pdf_transaction(
                                                    request.rows,
                                                    hospital_name
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
                                auth_user_id: str = Depends(get_auth_user_id)
):
    current_user = fetch_current_user(auth_user_id)
    check_permission(
                        current_user=current_user,
                        allowed_roles=["admin","normal"]
                    )

    csv_buffer = export_device_list_csv_transaction(request.rows)
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
                            auth_user_id: str = Depends(get_auth_user_id)
):
    current_user = fetch_current_user(auth_user_id)
    check_permission(
                        current_user=current_user,
                        allowed_roles=["admin","normal"]
                    )

    csv_buffer = export_history_csv_transaction(request.rows)

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
def fetch_hospital_management_route(auth_user_id: str = Depends(get_auth_user_id)):
    current_user = fetch_current_user(auth_user_id)
    check_permission(
                        current_user=current_user,
                        allowed_roles=["system_admin"]
                    )
    return fetch_hospital_management_transaction()

@app.post("/create-hospital")
def create_hospital(
                            request: AddHospitalRequest,
                            auth_user_id: str = Depends(get_auth_user_id),
                        ):
    current_user = fetch_current_user(auth_user_id)
    # System Adminのみ許可
    check_permission(
                        current_user=current_user,
                        allowed_roles=["system_admin"]
                    )


    add_hospital(hospital=request)

    return {
        "success": True
    }



@app.post("/update-hospital")
def update_hospital_route(
                            request: UpdateHospitalRequest,
                            auth_user_id: str = Depends(get_auth_user_id),
                        ):
    current_user = fetch_current_user(auth_user_id)
    check_permission(
                        current_user=current_user,
                        allowed_roles=["system_admin"]
                    )
    update_hospital(hospital=request)

    return {
        "message": "Hospital updated successfully"
    }

#ユーザー一覧取得
@app.get("/fetch-user-management")
def fetch_user_management_route(auth_user_id: str = Depends(get_auth_user_id)):

    current_user = fetch_current_user(auth_user_id)
    check_permission(
                        current_user=current_user,
                        allowed_roles=["system_admin"]
                    )

    return fetch_user_management_transaction()


#role,is activeを編集可能
@app.post("/update-user")
def update_user_route(
    request: UpdateUserRequest,
    auth_user_id: str = Depends(get_auth_user_id)
):
    print("update_user_route")
    current_user = (fetch_current_user(auth_user_id))
    print("role =", current_user["role"])
    check_permission(
                        current_user=current_user,
                        allowed_roles=["system_admin"]
                    )


    update_user_transaction(
        request=request,
        auth_user_id=auth_user_id
    )

#アカウント情報編集用コード送信用
@app.post("/create-account-edit-code")
def create_account_edit_code(auth_user_id: str = Depends(get_auth_user_id)):
    print("create_account_edit_code")
    current_user = fetch_current_user(auth_user_id)
    return create_account_edit_code_transaction(
                                                request=CreateAccountEditCodeRequest(
                                                                    user_id=current_user["id"],
                                                                    email=current_user["email"]                                                        
                                                                    ),
                                                )
#codeの有効性を判定し、有効なcodeならuser情報を返す
@app.post("/verify-account-edit-code")
def verify_account_edit_code(
                               request: VerifyAccountEditCodeRequest
                            ):
    print("verify_account_edit_code")

    account_edit_code = verify_account_edit_code_transaction(
                                                                code=request.code
                                                            )

    user = fetch_current_user(
                                auth_user_id=account_edit_code["user_id"]
                             )
    print("user:",user)
    return user


@app.post("/update-my-account")
def update_my_account(
                        request: UpdateMyAccountRequest,
                    ):
    print("update_my_account")

    update_my_account_transaction(
                                  request,
                                  )

    return {"message": "success"}