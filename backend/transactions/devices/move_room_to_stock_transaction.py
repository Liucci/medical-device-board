from common.supabase_client import supabase

from devices.move_device import move_device

from rooms.update_rooms import clear_room_patientname

from tasks.delete_tasks_by_device_id import delete_tasks_by_device_id

from schemas.device_schemas import MoveDeviceRequest
from schemas.room_schemas import ClearRoomPatientRequest


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

    # 患者名リセット
    clear_room_patientname(
                                room=room,
                                hospital_id=hospital_id,
                                patient_name=patient_name
                            )
    # task削除
    delete_tasks_by_device_id(
                                device_id=device.id,
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