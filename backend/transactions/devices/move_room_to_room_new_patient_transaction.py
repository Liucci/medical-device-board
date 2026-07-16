from common.supabase_admin_client import supabase

from devices.move_device import move_device

from devices.update_management_number import update_management_number
from devices.update_serial_number import update_serial_number
from devices.update_note import update_note
from devices.fetch_devices import fetch_devices_by_room_id
from rooms.update_rooms import (
                                  clear_room_patientname,
                                  update_room_patientname
                               )

from tasks.delete_tasks_by_device_id import delete_tasks_by_device_id
from room_infections.delete_room_infections import delete_room_infections_by_room_id
from transactions.tasks.create_device_tasks_transaction import (create_device_tasks_transaction)
from transactions.histories.create_device_history import (create_device_history)
from schemas.device_schemas import (
                                      MoveDeviceRequest,
                                      UpdateManagementNumberRequest,
                                      UpdateSerialNumberRequest,
                                      UpdateNoteRequest
                                   )

from schemas.room_schemas import (
                                    ClearRoomPatientRequest,
                                    UpdateRoomPatientRequest
                                 )


def move_room_to_room_new_patient_transaction(
                                                device: MoveDeviceRequest,
                                                pre_room: ClearRoomPatientRequest,
                                                post_room: UpdateRoomPatientRequest,
                                                hospital_id: str,
                                                user_id: str,
                                                pre_patient_name: str | None,
                                                management_number: str | None,
                                                serial_number: str | None,
                                                note: str | None,
                                                status: str,
                                                action_type: str,
                                                message: str
                                             ):

    print("move_room_to_room_new_patient_transaction")

    # 機器移動
    moved_device = move_device(
                                device=device,
                                hospital_id=hospital_id,
                                status=status,
                                user_id=user_id
                              )


    # 移動先患者名更新
    update_room_patientname(
                              room=post_room,
                              hospital_id=hospital_id
                           )

    # task削除
    delete_tasks_by_device_id(
                                device_id=device.id,
                                hospital_id=hospital_id
                             )

    # 管理番号クリア
    update_management_number(
                              device=UpdateManagementNumberRequest(
                                                                      id=device.id,
                                                                      management_number=management_number
                                                                   ),
                              hospital_id=hospital_id,
                              user_id=user_id
                            )

    # シリアル番号クリア
    update_serial_number(
                          device=UpdateSerialNumberRequest(
                                                            id=device.id,
                                                            serial_number=serial_number
                                                         ),
                          hospital_id=hospital_id,
                          user_id=user_id
                        )

    # 備考クリア
    update_note(
                  device=UpdateNoteRequest(
                                            id=device.id,
                                            note=note
                                         ),
                  hospital_id=hospital_id,
                  user_id=user_id
               )
    #pre roomの機器台数が0台で移動元の患者名削除
    room_devices = fetch_devices_by_room_id(
                                            room_id=pre_room.id,
                                            hospital_id=hospital_id
                                        )
    room_devices_count = len(room_devices)
    print("病室機器数 =", room_devices_count)
    if room_devices_count == 0:
         clear_room_patientname(
                            room=pre_room,
                            hospital_id=hospital_id,
                            patient_name=""
                          )
         #感染情報削除
         delete_room_infections_by_room_id(
                                          room_id=pre_room.id,
                                          hospital_id=hospital_id
                                       )



    # task再生成
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