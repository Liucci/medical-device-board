from fastapi import FastAPI,Depends
from fastapi.middleware.cors import (CORSMiddleware)
from fastapi import Header
from pydantic import BaseModel
import os
from common.supabase_client import supabase

from auth.login import (login_user)
from auth.fetch_current_user import (fetch_current_user)
from auth.get_auth_user_id import (get_auth_user_id)
from auth.refresh_token import (refresh_token)


from schemas.auth_schemas import RefreshTokenRequest
from schemas.invite_schemas import (CreateInviteCodeRequest)
from schemas.invite_schemas import (RegisterUserRequest)

from schemas.hospital_schemas import CreateHospitalRequest
from schemas.invite_schemas import InviteFirstAdminRequest

from transactions.invites.invite_first_admin_transaction import invite_first_admin_transaction
from transactions.invites.register_first_admin_transaction import register_first_admin_transaction
                                                                                                                                   

from transactions.invites.register_user_transaction import (register_user_transaction)
from transactions.auth.fetch_current_user_transaction import fetch_current_user_transaction

from transactions.tasks.complete_maintenance_task_transaction import complete_maintenance_task_transaction
from transactions.invites.create_invite_code_transaction import (create_invite_code_transaction)
from transactions.invites.get_invite_info_transaction import (get_invite_info_transaction)

from devices.fetch_devices import (fetch_devices)
from devices.add_device import (add_device)
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
                                        StartMaintenanceRequest,
                                        FinishMaintenanceRequest,
                                        StartStandbyRequest,
                                        FinishStandbyRequest,
                                        MoveDeviceRequest
                                    )
from schemas.stock_area_schemas import (AddStockAreaRequest,DeleteStockAreasRequest,UpdateStockAreaRequest)
from schemas.ward_schemas import (AddWardRequest,WardResponse,DeleteWardRequest,UpdateWardRequest)
from schemas.room_schemas import (AddRoomRequest,UpdateRoomRequest,UpdateRoomPatientRequest,DeleteRoomsRequest,ClearRoomPatientRequest)
from schemas.device_type_schemas import (AddDeviceTypeRequest,DeleteDeviceTypeRequest, UpdateDeviceTypeRequest)
from schemas.device_model_schemas import (AddDeviceModelRequest,DeviceModelsResponse,DeleteDeviceModelsRequest, UpdateDeviceModelRequest)
from schemas.maintenance_type_schemas import (AddMaintenanceTypeRequest, UpdateMaintenanceTypeRequest, DeleteMaintenanceTypesRequest)
from schemas.maintenance_task_schemas import CompleteMaintenanceTaskRequest
from transactions.fetch_init_dashboard import (fetch_init_dashboard)

from transactions.devices.create_device_transaction import (create_device_transaction)
from transactions.devices.delete_device_transaction import ( delete_device_transaction ) 
from transactions.devices.update_management_number_transaction import (update_management_number_transaction)
from transactions.devices.update_serial_number_transaction import (update_serial_number_transaction)
from transactions.devices.update_note_transaction import (update_note_transaction)
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

from transactions.wards.create_ward_transaction import (create_ward_transaction)
from transactions.wards.delete_ward_transaction import (delete_ward_transaction)
from transactions.wards.update_ward_transaction import (update_ward_transaction)

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
from fastapi.responses import StreamingResponse
from schemas.export_schemas import ExportHistoryPdfRequest
from transactions.exports.export_history_pdf_transaction import (export_history_pdf_transaction)
from schemas.export_schemas import (DeviceListExportSchemaRequest)
from transactions.exports.export_device_list_pdf_transaction import (export_device_list_pdf_transaction)
from transactions.exports.export_device_list_csv_transaction import (export_device_list_csv_transaction)
from transactions.exports.export_history_csv_transaction import (export_history_csv_transaction)

from fastapi.responses import StreamingResponse



from dotenv import load_dotenv
load_dotenv()


app = FastAPI()
#originを指定してCORSを許可する
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
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

    response = refresh_token(body.refresh_token)
    auth_user_id = (response.user.id)
    current_user = (fetch_current_user(auth_user_id))

    return {
            "access_token":response.session.access_token,
            "refresh_token":response.session.refresh_token,
            "current_user":current_user
    }

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
                register:RegisterUserRequest
            ):
    return register_user_transaction(register)

#first admin userをDB登録する
@app.post("/register-first-admin")
def register_first_admin_route(
                                register: RegisterUserRequest
                              ):

    return register_first_admin_transaction(
                                              register
                                           )




@app.get("/current-user")
def current_user(
                    auth_user_id:str=Depends(get_auth_user_id)
                ):
    return fetch_current_user_transaction(auth_user_id)

@app.post("/invite-first-admin")
def invite_first_admin_route(
                              request: InviteFirstAdminRequest,
                              auth_user_id: str = Depends(get_auth_user_id)
                            ):

    current_user = fetch_current_user(auth_user_id)

    if current_user["role"] != "system_admin":
        return {
                  "success": False,
                  "error": "権限がありません"
               }

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
    current_user = (
        fetch_current_user(
            auth_user_id
        )
    )
    if (
        current_user["role"]
        != "admin"
    ):
        return {
            "success": False,
            "error":
            "権限がありません"
        }
    devices = (
        fetch_devices(
            hospital_id=
            current_user[
                "hospital_id"
            ]
        )
    )
    return devices

#機器アイコンの新規登録用のAPI
@app.post("/create-device-transaction")
def create_device_transaction_route(
                                    body: AddDeviceRequest,
                                    auth_user_id: str = Depends(get_auth_user_id)
                                   ):

    current_user = fetch_current_user(auth_user_id)

    if current_user["role"] != "admin":
        return {
                    "success": False,
                    "error": "権限がありません"
               }

    create_device_transaction(
                            device=body,
                            hospital_id=current_user["hospital_id"],
                            user_id=current_user["id"],
                            stock_area_id=1,
                            status="stock",
                            action_type="device_created",
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
    if current_user["role"] != "admin":
        return {"error": "権限がありません"}

    delete_device_transaction(
                            device=body,
                            hospital_id=current_user["hospital_id"],
                            user_id=current_user["id"],
                            action_type="device_deleted",
                            message="機器を削除"
                         )    





@app.get("/stock-areas")
def get_stock_areas(auth_user_id: str = Depends(get_auth_user_id)):
    current_user = (
        fetch_current_user(
            auth_user_id
        )
    )

    if (
        current_user["role"]
        != "admin"
    ):

        return {

            "success": False,

            "error":
            "権限がありません"
        }

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
    current_user = (
        fetch_current_user(
            auth_user_id
        )
    )

    if (
        current_user["role"]
        != "admin"
    ):

        return {
            "success": False,
            "error":
            "権限がありません"
        }

    wards = (
        fetch_wards(

            hospital_id=
            current_user[
                "hospital_id"
            ]
        )
    )

    return wards

@app.post("/wards")
def create_ward_route(
                        ward: AddWardRequest,
                        auth_user_id: str = Depends(get_auth_user_id)
                     ):
    current_user = (fetch_current_user(auth_user_id))
    if (
        current_user["role"]
        != "admin"
    ):
        
        return {
            "success": False,
            "error":
            "権限がありません"
        }

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
    if (
        current_user["role"]
        != "admin"
    ):
        return {
            "success": False,
            "error":
            "権限がありません"
        }
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
    if (current_user["role"]
        != "admin"):
        return {
            "success": False,
            "error":
            "権限がありません"
        }

    update_ward_transaction(
                                ward=ward,
                                hospital_id=current_user["hospital_id"]
                            )

@app.get("/rooms")
def get_rooms(auth_user_id: str = Depends(get_auth_user_id)):
    current_user = (
        fetch_current_user(
            auth_user_id
        )
    )

    if (
        current_user["role"]
        != "admin"
    ):

        return {

            "success": False,

            "error":
            "権限がありません"
        }

    rooms = (
        fetch_rooms(

            hospital_id=
            current_user[
                "hospital_id"
            ]
        )
    )

    return rooms

@app.post("/rooms")
def create_room_route(
                        room:AddRoomRequest,
                        auth_user_id:str = Depends(get_auth_user_id)
                     ):

    current_user = fetch_current_user(auth_user_id)
    if (
        current_user["role"]
        != "admin"
    ):
        return {
            "success": False,
            "error":
            "権限がありません"
        }

    create_room_transaction(
                                room=room,
                                hospital_id=current_user["hospital_id"]
                            )

@app.post("/update-room")
def update_room_route(
                        room: UpdateRoomRequest,
                        auth_user_id: str = Depends(get_auth_user_id)):
    
    current_user = fetch_current_user(auth_user_id)
    if (
        current_user["role"]
        != "admin"
    ):
        return {
            "success": False,
            "error":
            "権限がありません"
        }

    update_room_transaction(
                                     room=room,
                                     hospital_id=current_user["hospital_id"]
                                   )


@app.post("/update-room-patientname")
def update_room_patientname_route(
                                    room: UpdateRoomPatientRequest,
                                    auth_user_id: str = Depends(get_auth_user_id)):
                                  
    current_user = fetch_current_user(auth_user_id)
    if (
        current_user["role"]
        != "admin"
    ):
        return {
            "success": False,
            "error":
            "権限がありません"
        }

    update_room_patientname_transaction(
                                                 room=room,
                                                 hospital_id=current_user["hospital_id"]
                                               )


@app.post("/update-device-type")
def update_device_type_route(
                                device_type: UpdateDeviceTypeRequest,
                                auth_user_id: str = Depends(get_auth_user_id)
                            ):
    print("update_device_type")
    current_user = fetch_current_user(auth_user_id)
    if (
        current_user["role"]
        != "admin"
    ):
        return {
            "success": False,
            "error":
            "権限がありません"
        }

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
    if (
        current_user["role"]
        != "admin"
    ):
        return {
            "success": False,
            "error":
            "権限がありません"
        }

    delete_room_transaction(
                              room=room,
                              hospital_id=current_user["hospital_id"]
                           )

@app.get("/device-types")
def get_device_types(auth_user_id: str = Depends(get_auth_user_id)):
                                  
    current_user = fetch_current_user(auth_user_id)
    print("get_device_types")
    if (
        current_user["role"]
        != "admin"
    ):
        return {
            "success": False,
            "error":
            "権限がありません"
        }

    return fetch_device_types(current_user["hospital_id"])

@app.post("/device-types")
def create_device_type_route(
                                device_type: AddDeviceTypeRequest,
                                auth_user_id: str = Depends(get_auth_user_id)
                            ):
    print("create_device_type_route")
    current_user = fetch_current_user(auth_user_id)
    if (
        current_user["role"]
        != "admin"
    ):
            return {
            "success": False,
            "error":
            "権限がありません"
        }

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
    if (
        current_user["role"]
        != "admin"
    ):
            return {
            "success": False,
            "error":
            "権限がありません"
        }

    delete_device_type_transaction(
                                    device_type,
                                    hospital_id=current_user["hospital_id"]
                                  )

@app.get("/device-models")
def get_device_models(auth_user_id: str = Depends(get_auth_user_id)):
    current_user = fetch_current_user(auth_user_id)
    print("get_device_models")
    if (
        current_user["role"]
        != "admin"
    ):
        return {
            "success": False,
            "error":
            "権限がありません"
        }

    return fetch_device_models(current_user["hospital_id"])

@app.post("/device-models")
def create_device_model(
                            device_model: AddDeviceModelRequest,
                            auth_user_id: str = Depends(get_auth_user_id)
                        ):

    current_user = fetch_current_user(auth_user_id)
    print("create_device_model")
    if (
        current_user["role"]
        != "admin"
    ):
        return {
            "success": False,
            "error":
            "権限がありません"
        }

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
    if (
        current_user["role"]
        != "admin"
    ):
        return {
            "success": False,
            "error":
            "権限がありません"
        }

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
    if (
        current_user["role"]
        != "admin"
    ):
        return {
            "success": False,
            "error":
            "権限がありません"
        }

    update_device_model_transaction(
                                            device_model,
                                            current_user["hospital_id"]
                                          )

@app.get("/tasks")
def get_tasks(

    auth_user_id: str = Depends(get_auth_user_id)
):
    current_user = (
        fetch_current_user(
            auth_user_id
        )
    )

    if (
        current_user["role"]
        != "admin"
    ):
        return {
            "success": False,
            "error": "権限がありません"
        }

    tasks = (
        fetch_maintenance_tasks(
            hospital_id=
            current_user[
                "hospital_id"
            ]
        )
    )

    return tasks

@app.get("/maintenance-types")
def get_maintenance_types(auth_user_id: str = Depends(get_auth_user_id)):

    current_user = fetch_current_user(auth_user_id)

    if (
        current_user["role"]
        != "admin"
    ):
        return {
            "success": False,
            "error":
            "権限がありません"
        }

    print("get_maintenance_types")

    return fetch_maintenance_types(current_user["hospital_id"])


@app.post("/maintenance-types")
def create_maintenance_type_route(maintenance_type: AddMaintenanceTypeRequest, auth_user_id: str = Depends(get_auth_user_id)):

    current_user = fetch_current_user(auth_user_id)

    if (
        current_user["role"]
        != "admin"
    ):
        return {
            "success": False,
            "error":
            "権限がありません"
        }

    print("create_maintenance_type")

    return create_maintenance_type_transaction(
                                                maintenance_type,
                                                current_user["hospital_id"],
                                                auth_user_id
                                              )


@app.post("/update-maintenance-type")
def update_maintenance_type_route(maintenance_type: UpdateMaintenanceTypeRequest, auth_user_id: str = Depends(get_auth_user_id)):

    current_user = fetch_current_user(auth_user_id)

    if (
        current_user["role"]
        != "admin"
    ):
        return {
            "success": False,
            "error":
            "権限がありません"
        }

    print("update_maintenance_type")

    return update_maintenance_type_transaction(
                                                maintenance_type,
                                                current_user["hospital_id"]
                                              )


@app.post("/delete-maintenance-types")
def delete_maintenance_types_route(maintenance_types: DeleteMaintenanceTypesRequest, auth_user_id: str = Depends(get_auth_user_id)):

    current_user = fetch_current_user(auth_user_id)

    if (
        current_user["role"]
        != "admin"
    ):
        return {
            "success": False,
            "error":
            "権限がありません"
        }

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

    if (
        current_user["role"]
        != "admin"
    ):

        return {

            "success": False,

            "error":
            "権限がありません"
        }

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

    response = create_stock_area_transaction(
                                                stock_area=stock_area,
                                                current_user=current_user
                                             )

    return response

@app.post("/delete-stock-area-transaction")
def delete_stock_area_transaction_route(
                                          stock_area: DeleteStockAreasRequest,
                                          auth_user_id: str = Depends(
                                          get_auth_user_id)
                                        ):
    current_user = (fetch_current_user(auth_user_id))

    delete_stock_area_transaction(
                                    stock_area=stock_area,
                                    current_user=current_user
                                 )

@app.post("/update-stock-area-transaction")
def update_stock_area_transaction_route(
                                          stock_area: UpdateStockAreaRequest,
                                          auth_user_id: str = Depends(
                                          get_auth_user_id)
                                        ):

    current_user = fetch_current_user(auth_user_id)

    update_stock_area_transaction(
                                    stock_area=stock_area,
                                    current_user=current_user
                                    )

@app.post("/update-management-number")
def update_management_number_route(
                                     body: UpdateManagementNumberRequest,
                                     auth_user_id: str = Depends(get_auth_user_id)
                                   ):

    current_user = fetch_current_user(auth_user_id)

    if current_user["role"] != "admin":
        return {
                    "error": "権限がありません"
               }

    update_management_number_transaction(
                                            device=body,
                                            hospital_id=current_user["hospital_id"],
                                            user_id=current_user["id"],
                                            action_type="management_number_updated",
                                            message="管理番号を更新"
                                         )

@app.post("/update-serial-number")
def update_serial_number_route(
                                 body: UpdateSerialNumberRequest,
                                 auth_user_id: str = Depends(get_auth_user_id)
                               ):

    current_user = fetch_current_user(auth_user_id)

    if current_user["role"] != "admin":
        return {
                    "error": "権限がありません"
               }

    update_serial_number_transaction(
                                        device=body,
                                        hospital_id=current_user["hospital_id"],
                                        user_id=current_user["id"],
                                        action_type="serial_number_updated",
                                        message="シリアル番号を更新"
                                     )

@app.post("/update-note")
def update_note_route(
                        body: UpdateNoteRequest,
                        auth_user_id: str = Depends(get_auth_user_id)
                      ):

    current_user = fetch_current_user(auth_user_id)

    if current_user["role"] != "admin":
        return {
                    "error": "権限がありません"
               }

    update_note_transaction(
                              device=body,
                              hospital_id=current_user["hospital_id"],
                              user_id=current_user["id"],
                              action_type="note_updated",
                              message="備考を更新"
                           )

@app.post("/start-maintenance")
def start_maintenance_route(
                              body: StartMaintenanceRequest,
                              auth_user_id: str = Depends(get_auth_user_id)
                            ):

    current_user = fetch_current_user(auth_user_id)

    if current_user["role"] != "admin":
        return {
                    "error": "権限がありません"
               }

    start_maintenance_transaction(
                                    device=body,
                                    hospital_id=current_user["hospital_id"],
                                    user_id=current_user["id"],
                                    action_type="maintenance_started",
                                    message="保守開始"
                                 )

@app.post("/finish-maintenance")
def finish_maintenance_route(
                               body: FinishMaintenanceRequest,
                               auth_user_id: str = Depends(get_auth_user_id)
                             ):

    current_user = fetch_current_user(auth_user_id)

    if current_user["role"] != "admin":
        return {
                    "error": "権限がありません"
               }

    finish_maintenance_transaction(
                                     device=body,
                                     hospital_id=current_user["hospital_id"],
                                     user_id=current_user["id"],
                                     action_type="maintenance_finished",
                                     message="保守終了"
                                  )

@app.post("/start-standby")
def start_standby_route(
                          body: StartStandbyRequest,
                          auth_user_id: str = Depends(get_auth_user_id)
                        ):

    current_user = fetch_current_user(auth_user_id)

    if current_user["role"] != "admin":
        return {
                    "error": "権限がありません"
               }

    start_standby_transaction(
                                device=body,
                                hospital_id=current_user["hospital_id"],
                                user_id=current_user["id"],
                                action_type="standby_started",
                                message="スタンバイ開始"
                             )

@app.post("/finish-standby")
def finish_standby_route(
                           body: FinishStandbyRequest,
                           auth_user_id: str = Depends(get_auth_user_id)
                         ):

    current_user = fetch_current_user(auth_user_id)

    if current_user["role"] != "admin":
        return {
                    "error": "権限がありません"
               }

    finish_standby_transaction(
                                 device=body,
                                 hospital_id=current_user["hospital_id"],
                                 user_id=current_user["id"],
                                 action_type="standby_finished",
                                 message="スタンバイ終了"
                              )





@app.post("/move_stock_to_room")
def move_stock_to_room_route(
                              device: MoveDeviceRequest,
                              room: UpdateRoomPatientRequest,
                              auth_user_id: str = Depends(get_auth_user_id)
                           ):

    current_user = fetch_current_user(
                                        auth_user_id
                                     )

    print("move_stock_to_room")

    moved_device = move_stock_to_room_transaction(
                                                    device=device,
                                                    room=room,
                                                    hospital_id=current_user["hospital_id"],
                                                    user_id=current_user["id"],
                                                    status="room",
                                                    action_type="moved_to_room",
                                                    message="stock to room"
                                                  )

    return moved_device


@app.post("/move_stock_to_stock")
def move_stock_to_stock_route(
                                device: MoveDeviceRequest,
                                auth_user_id: str = Depends(get_auth_user_id)
                             ):

    current_user = fetch_current_user(
                                        auth_user_id
                                     )

    print("move_stock_to_stock")

    moved_device = move_stock_to_stock_transaction(
                                                    device=device,
                                                    hospital_id=current_user["hospital_id"],
                                                    user_id=current_user["id"],
                                                    status="stock",
                                                    action_type="moved_to_stock",
                                                    message="stock to stock"
                                                  )

    return moved_device

@app.post("/move_room_to_stock")
def move_room_to_stock_route(
                              device: MoveDeviceRequest,
                              room: ClearRoomPatientRequest,
                              auth_user_id: str = Depends(get_auth_user_id)
                            ):

    current_user = fetch_current_user(
                                        auth_user_id
                                     )

    print("move_room_to_stock")

    moved_device = move_room_to_stock_transaction(
                                                    device=device,
                                                    room=room,
                                                    hospital_id=current_user["hospital_id"],
                                                    user_id=current_user["id"],
                                                    patient_name=None,
                                                    status="stock",
                                                    action_type="moved_to_stock",
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

    current_user = fetch_current_user(
                                        auth_user_id
                                     )
    print("move_room_to_room")
    moved_device=move_room_to_room_transaction(
                                            device=device,
                                            pre_room=pre_room,
                                            post_room=post_room,
                                            hospital_id=current_user["hospital_id"],
                                            user_id=current_user["id"],
                                            pre_patient_name=None,
                                            status="room",
                                            action_type="moved_to_room",
                                            message="Room moved"
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

    current_user = fetch_current_user(
                                        auth_user_id
                                     )

    print("move_room_to_room_new_patient")

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
                                                              action_type="moved_to_room_new_patient",
                                                              message="Room moved new patient"
                                                            )

    return moved_device

@app.post("/complete_maintenance_task")
def complete_maintenance_task_api(
                                    task: CompleteMaintenanceTaskRequest,
                                    auth_user_id: str = Depends(get_auth_user_id)
                                 ):

    current_user = (
                      fetch_current_user(
                                            auth_user_id
                                        )
                   )

    if current_user["role"] != "admin":
        return {
                  "success": False,
                  "error": "権限がありません"
               }

    return complete_maintenance_task_transaction(
                                                    task=task,
                                                    hospital_id=current_user["hospital_id"],
                                                    user_id=current_user["id"],
                                                    action_type="update",
                                                    message="maintenance completed"
                                                )







@app.post("/export-history-pdf")
async def export_history_pdf_route(
    request: ExportHistoryPdfRequest,
    auth_user_id: str = Depends(get_auth_user_id)    
):
    print("auth_user_id:", auth_user_id)
    current_user = fetch_current_user(auth_user_id)
    hospital = fetch_hospital(current_user["hospital_id"])
    print("hospital:",hospital)
    hospital_name = hospital["hospital_name"]


    # debug
    print("route called")
    print("row count:", len(request.rows))
    if request.rows:
        for key, value in request.rows[0].model_dump().items():
            print(f"・{key}: {value}")
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
    print("auth_user_id:", auth_user_id)

    current_user = fetch_current_user(auth_user_id)

    hospital = fetch_hospital(
                                current_user["hospital_id"]
                              )

    print("hospital:", hospital)

    hospital_name = hospital["hospital_name"]

    # debug
    print("route called")
    print("row count:", len(request.rows))

    if request.rows:
        for key, value in request.rows[0].model_dump().items():
            print(f"・{key}: {value}")

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

    csv_buffer = export_device_list_csv_transaction(
        request.rows
    )

    return StreamingResponse(
        csv_buffer,
        media_type="text/csv",
        headers={
            "Content-Disposition":
                "attachment; filename=device_list.csv"
        }
    )

@app.post("/export-history-csv")
def export_history_csv_route(
    request: ExportHistoryPdfRequest,
    auth_user_id: str = Depends(get_auth_user_id)
):
    csv_buffer = export_history_csv_transaction(
    request.rows
)

    return StreamingResponse(
        csv_buffer,
        media_type="text/csv",
        headers={
            "Content-Disposition":
            "attachment; filename=histories.csv"
        }
)