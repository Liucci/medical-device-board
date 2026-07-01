from common.supabase_client import supabase
from devices.move_device import move_device
from rooms.update_rooms import update_room_patientname
from maintenance_types.fetch_maintenance_types import fetch_maintenance_types
from transactions.tasks.create_device_tasks_transaction import create_device_tasks_transaction
from schemas.device_schemas import MoveDeviceRequest
from schemas.room_schemas import UpdateRoomPatientRequest
from schemas.maintenance_task_schemas import AddMaintenanceTaskRequest
from transactions.histories.create_device_history import (create_device_history)

def move_stock_to_room_transaction(
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
                              room=room,
                              hospital_id=hospital_id
                           )
    # 機器移動
    moved_device = move_device(
                                device=device,
                                hospital_id=hospital_id,
                                status=status,
                                user_id=user_id
                              )
    # task生成
    create_device_tasks_transaction(
                                  device_id=device.id,
                                  hospital_id=hospital_id
                               )

# 履歴作成
    create_device_history(
                        device_id=device.id,
                        hospital_id=hospital_id,
                        action_by=user_id,
                        action_type=action_type,
                        message=message
                     )
    return moved_device