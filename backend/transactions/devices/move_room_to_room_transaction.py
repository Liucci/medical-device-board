from common.supabase_client import supabase

from devices.move_device import move_device

from rooms.update_rooms import (
                                  clear_room_patientname,
                                  update_room_patientname
                               )

from schemas.device_schemas import MoveDeviceRequest
from schemas.room_schemas import (
                                    ClearRoomPatientRequest,
                                    UpdateRoomPatientRequest
                                 )


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

    # 機器移動
    moved_device = move_device(
                                device=device,
                                hospital_id=hospital_id,
                                status=status
                              )

    # 履歴作成
    supabase.table("device_histories").insert({
                                                "hospital_id": hospital_id,
                                                "device_id": device.id,
                                                "action_by": user_id,
                                                "action_type": action_type,
                                                "message": message
                                              }).execute()

    return moved_device