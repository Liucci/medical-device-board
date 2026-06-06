from fastapi import FastAPI,Depends
from fastapi.middleware.cors import (CORSMiddleware)
from fastapi import Header
from pydantic import BaseModel

from auth.login import (login_user)
from auth.fetch_current_user import (fetch_current_user)
from auth.get_auth_user_id import (get_auth_user_id)

from devices.fetch_devices import (fetch_devices)
from devices.add_devices import (add_device)
from stock_areas.fetch_stock_areas import (fetch_stock_areas)
from wards.fetch_wards import (fetch_wards)
from rooms.fetch_rooms import (fetch_rooms)
from users.fetch_users import (fetch_users)
from device_types.fetch_device_type import (fetch_device_types )
from device_models.fetch_device_models import (fetch_device_models)

from tasks.fetch_maintenance_tasks import (fetch_maintenance_tasks)
from histories.fetch_histories import (fetch_histories)
from maintenance_types.fetch_maintenance_types import (fetch_maintenance_types)

from schemas.device_schemas import (AddDeviceRequest,DeleteDeviceRequest,UpdateDeviceInfoRequest)
from schemas.stock_area_schemas import (AddStockAreaRequest,DeleteStockAreasRequest,UpdateStockAreaRequest)
from schemas.ward_schemas import (AddWardRequest,WardResponse,DeleteWardRequest,UpdateWardRequest)
from schemas.room_schemas import (AddRoomRequest,UpdateRoomRequest,UpdateRoomPatientRequest,DeleteRoomsRequest)
from schemas.device_type_schemas import (AddDeviceTypeRequest,DeleteDeviceTypesRequest, UpdateDeviceTypeRequest)
from schemas.device_model_schemas import (AddDeviceModelRequest,DeviceModelsResponse,DeleteDeviceModelsRequest, UpdateDeviceModelRequest)

from transactions.fetch_init_dashboard import (fetch_init_dashboard)

from transactions.devices.create_device_transaction import (create_device_transaction)
from transactions.devices.delete_device_transaction import ( delete_device_transaction ) 

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
    auth_user_id = (
        response.user.id
    )
    current_user = (
        fetch_current_user(
            auth_user_id
        )
    )
    print("===== current user =====")
    print(current_user)
    return {
        "success": True,
        "access_token":
        response.session.access_token,

        "refresh_token":
        response.session.refresh_token,

        "current_user":
        current_user
    }

@app.get("/")
def root():

    return {
        "message":
        "backend running"
    }

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
    print(current_user["role"])
    print(type(current_user["role"]))
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

    create_room_transaction(
                                room=room,
                                hospital_id=current_user["hospital_id"]
                            )

@app.post("/update-room")
def update_room_route(
                        room: UpdateRoomRequest,
                        auth_user_id: str = Depends(get_auth_user_id)):
    
    current_user = fetch_current_user(auth_user_id)
    update_room_transaction(
                                     room=room,
                                     hospital_id=current_user["hospital_id"]
                                   )


@app.post("/update-room-patientname")
def update_room_patientname_route(
                                    room: UpdateRoomPatientRequest,
                                    auth_user_id: str = Depends(get_auth_user_id)):
                                  
    current_user = fetch_current_user(auth_user_id)
    return update_room_patientname_transaction(
                                                 room=room,
                                                 hospital_id=current_user["hospital_id"]
                                               )


@app.post("/update-device-type")
def update_device_type_route(
                                device_type: UpdateDeviceTypeRequest,
                                auth_user_id: str = Depends(get_auth_user_id)
                            ):

    current_user = fetch_current_user(auth_user_id)

    print("update_device_type")

    return update_device_type_transaction(
                                            device_type,
                                            current_user["hospital_id"]
                                          )


@app.post("/delete-rooms-transaction")
def delete_rooms_transaction_route(
                                    room: DeleteRoomsRequest,
                                    auth_user_id: str = Depends(get_auth_user_id)):
                                  
    current_user = fetch_current_user(auth_user_id)
    print("delete room transaction route")

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
    current_user = fetch_current_user(auth_user_id)

    print("create_device_type_route")
    create_device_type_transaction(
                                    device_type,
                                    hospital_id=current_user["hospital_id"]
                                    )

@app.post("/delete-device-type")
def delete_device_type_route(
                                device_type:DeleteDeviceTypesRequest,
                                auth_user_id:str = Depends(get_auth_user_id)
                            ):

    current_user = fetch_current_user(auth_user_id)

    print("delete_device_type_route")

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

    return create_device_model_transaction(
                                            device_model,
                                            current_user["hospital_id"]
                                          )


@app.get("/tasks")
def get_tasks(auth_user_id: str = Depends(get_auth_user_id)):
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

    tasks = (
        fetch_maintenance_tasks(

            hospital_id=
            current_user[
                "hospital_id"
            ]
        )
    )

    return  tasks

@app.get("/maintenance-types")
def get_maintenance_types(auth_user_id: str = Depends(get_auth_user_id)):
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

    maintenance_types = (
        fetch_maintenance_types(

            hospital_id=
            current_user[
                "hospital_id"
            ]
        )
    )

    return maintenance_types

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
        fetch_histories(

            hospital_id=
            current_user[
                "hospital_id"
            ]
        )
    )

    return histories

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
                                status="stock"
                              )

#リロードの際に必要なデータをDBからまとめて取得するAPI
@app.get("/init-dashboard")
def init_dashboard(
    auth_user_id: str = Depends(
        get_auth_user_id
    )
):

    current_user = (
        fetch_current_user(
            auth_user_id
        )
    )

    return fetch_init_dashboard(
        hospital_id=
            current_user[
                "hospital_id"
            ]
    )

#機器アイコンを削除するAPI
@app.post("/delete-device-transaction")
def delete_device_transaction_route(
                                        body: DeleteDeviceRequest,
                                        auth_user_id: str = Depends(
                                                                    get_auth_user_id
                                                                  )
                                   ):

    current_user = fetch_current_user(auth_user_id)

    print("current_user")

    if current_user["role"] != "admin":

        return {
                    "error": "権限がありません"
               }

    delete_device_transaction(
                                device=body,
                                hospital_id=current_user["hospital_id"],
                                user_id=current_user["id"],
                             )
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














