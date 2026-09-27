from supabase import Client
from devices.move_device import move_device
from rooms.update_rooms import update_room_patientname
from transactions.tasks.create_device_tasks_transaction import create_device_tasks_transaction
from schemas.device_schemas import MoveDeviceRequest
from schemas.room_schemas import UpdateRoomPatientRequest
from transactions.histories.create_device_history import (create_device_history)
from transactions.tasks.delete_device_tasks_transaction import delete_device_tasks_transaction
from transactions.tasks.create_device_tasks_transaction import create_device_tasks_transaction

def move_stock_to_room_transaction(
                                     client:Client,
                                     device: MoveDeviceRequest,
                                     room: UpdateRoomPatientRequest,
                                     hospital_id: str,
                                     user_id: str,
                                     action_type: str,
                                     message: str,
                                     status:str
                                   ):

    print("move_stock_to_room_transaction")

    # 病室患者情報更新
    update_room_patientname(
                              client=client, 
                              room=room,
                              hospital_id=hospital_id
                           )
    # 機器移動
    moved_device = move_device( 
                                client=client, 
                                device=device,
                                hospital_id=hospital_id,
                                status=status,
                                user_id=user_id
                              )
    # 対象のstock用tasks削除後、room用tasks生成
    delete_device_tasks_transaction(
                                             client=client,
                                             device_id=device.id,
                                             new_status="room",
                                             hospital_id=hospital_id
                                          )

    create_device_tasks_transaction(
                                       client=client,
                                       device_id=device.id,
                                       new_status="room",
                                       hospital_id=hospital_id
                                    )
# 履歴作成
    create_device_history(
                        client=client, 
                        device_id=device.id,
                        hospital_id=hospital_id,
                        action_by=user_id,
                        action_type=action_type,
                        message=message
                     )
    return moved_device