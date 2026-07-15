from common.supabase_admin_client import supabase
from devices.move_device import move_device
from devices.fetch_devices import fetch_devices_by_room_id
from devices.finish_standby import (finish_standby,clear_standby)

from rooms.update_rooms import clear_room_patientname
from tasks.delete_tasks_by_device_id import delete_tasks_by_device_id
from schemas.device_schemas import MoveDeviceRequest
from schemas.room_schemas import ClearRoomPatientRequest
from transactions.histories.create_device_history import (create_device_history)
from room_infections.delete_room_infections import delete_room_infections_by_room_id
def move_room_to_stock_transaction(
                                    device: MoveDeviceRequest,
                                    room: ClearRoomPatientRequest,
                                    hospital_id: str,
                                    user_id: str,
                                    patient_name:str,
                                    status: str,
                                    action_type: str,
                                    message: str
                                  ):

    print("move_room_to_stock_transaction")

    # 機器移動
    moved_device = move_device(
                                device=device,
                                hospital_id=hospital_id,
                                status=status,
                                user_id=user_id
                              )

    # standby解除
    finish_standby(
                      device=device,
                      hospital_id=hospital_id
                  )



    # task削除
    delete_tasks_by_device_id(
                                device_id=device.id,
                                hospital_id=hospital_id
                             )

    #roomの機器台数が0台で移動元の患者名削除
    room_devices = fetch_devices_by_room_id(
                                            room_id=room.id,
                                            hospital_id=hospital_id)
    room_devices_count = len(room_devices)
    print("病室機器数 =", room_devices_count)
    if room_devices_count == 0:
         clear_room_patientname(
                            room=room,
                            hospital_id=hospital_id,
                            patient_name=""
                          )
         #感染情報削除
         delete_room_infections_by_room_id(
                                          room_id=room.id,
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
    clear_standby(
                      device=device,
                      hospital_id=hospital_id
                  )


    return moved_device