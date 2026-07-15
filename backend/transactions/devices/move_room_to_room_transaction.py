from common.supabase_admin_client import supabase
from devices.move_device import move_device
from rooms.update_rooms import (  clear_room_patientname,
                                  update_room_patientname)
from schemas.device_schemas import MoveDeviceRequest
from schemas.room_schemas import ( ClearRoomPatientRequest,
                                    UpdateRoomPatientRequest)
from transactions.histories.create_device_history import (create_device_history)
from transactions.room_infections.move_room_infections import move_room_infections
def move_room_to_room_transaction(
                                    device: MoveDeviceRequest,
                                    pre_room: ClearRoomPatientRequest,
                                    post_room: UpdateRoomPatientRequest,
                                    hospital_id: str,
                                    user_id: str,
                                    pre_patient_name: str,
                                    status: str,
                                    action_type: str,
                                    message: str
                                 ):

    print("move_room_to_room_transaction")
    # 機器移動
    moved_device = move_device(
                                device=device,
                                hospital_id=hospital_id,
                                status=status,
                                user_id=user_id
                              )



    # 移動元患者名クリア
    clear_room_patientname(
                            room=pre_room,
                            hospital_id=hospital_id,
                            patient_name=pre_patient_name
                          )

    # 移動先患者名設定
    #post_patient_nameはfrontから送られる
    update_room_patientname(
                              room=post_room,
                              hospital_id=hospital_id
                           )
    #移動元感染情報削除、移動先感染情報追加
    move_room_infections(
                        from_room_id=pre_room.id,
                        to_room_id=post_room.id,
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