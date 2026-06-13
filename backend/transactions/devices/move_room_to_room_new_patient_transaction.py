from common.supabase_client import supabase

from devices.move_device import move_device

from devices.update_management_number import update_management_number
from devices.update_serial_number import update_serial_number
from devices.update_note import update_note

from rooms.update_rooms import (
                                  clear_room_patientname,
                                  update_room_patientname
                               )

from tasks.delete_tasks_by_device_id import delete_tasks_by_device_id

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

    # 移動元患者名クリア
    clear_room_patientname(
                            room=pre_room,
                            hospital_id=hospital_id,
                            patient_name=pre_patient_name
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
                              hospital_id=hospital_id
                            )

    # シリアル番号クリア
    update_serial_number(
                          device=UpdateSerialNumberRequest(
                                                            id=device.id,
                                                            serial_number=serial_number
                                                         ),
                          hospital_id=hospital_id
                        )

    # 備考クリア
    update_note(
                  device=UpdateNoteRequest(
                                            id=device.id,
                                            note=note
                                         ),
                  hospital_id=hospital_id
               )

    # 機器移動
    moved_device = move_device(
                                device=device,
                                hospital_id=hospital_id,
                                status=status
                              )

    # task再生成
    create_device_tasks_transaction(
                                      device_id=device.id,
                                      hospital_id=hospital_id
                                   )

    # 履歴作成
# 履歴作成
    create_device_history(
                            device_id=device.id,
                            hospital_id=hospital_id,
                            action_by=user_id,
                            action_type=action_type,
                            message=message
                        )
    return moved_device