from transactions.histories.create_device_history import create_device_history
from devices.delete_device import delete_device
from tasks.delete_tasks_by_device_id import delete_tasks_by_device_id
from schemas.device_schemas import DeleteDeviceRequest
from schemas.room_schemas import ClearRoomPatientRequest
from devices.fetch_devices import fetch_devices_by_room_id,fetch_device
from rooms.update_rooms import clear_room_patientname
from room_infections.delete_room_infections import delete_room_infections_by_room_id


def delete_device_transaction(
                                device: DeleteDeviceRequest,
                                hospital_id: str,
                                user_id: str,
                                action_type: str,
                                message: str
                             ):

    print("delete_device_transaction")
    #device: DeleteDeviceRequestのidでdevice情報を取得
    device_info = fetch_device(
                            device_id=device.id,
                            hospital_id=hospital_id
                          )
    #削除するdeviceのあるroom_idを取得
    room_id = device_info["room_id"]
    #room idが無い場合
    if room_id is None:
             create_device_history(
                            device_id=device.id,
                            hospital_id=hospital_id,
                            action_by=user_id,
                            action_type=action_type,
                            message=message
                         )

             delete_device(
                           device=device,
                           hospital_id=hospital_id
                        )
             return
     
    create_device_history(
                            device_id=device.id,
                            hospital_id=hospital_id,
                            action_by=user_id,
                            action_type=action_type,
                            message=message
                         )

    delete_tasks_by_device_id(
                                device_id=device.id,
                                hospital_id=hospital_id
                             )
    delete_device(
                    device=device,
                    hospital_id=hospital_id
                 )

    
    #削除したdeviceのroom内で他機器が存在するか判定
    devices = fetch_devices_by_room_id(
                                             room_id=room_id,
                                             hospital_id=hospital_id
                                          )
   #0台の時、患者名と感染情報削除する
    if len(devices) > 0:
            return

    clear_room_patientname(
                           room=ClearRoomPatientRequest(id=room_id),
                           hospital_id=hospital_id,
                           patient_name=""
                        )

    delete_room_infections_by_room_id(
                                    room_id=room_id,
                                          hospital_id=hospital_id
                                       )
