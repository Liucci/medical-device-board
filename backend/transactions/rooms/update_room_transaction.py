from rooms.update_rooms import (
                                  update_room,
                                  update_room_patientname
                                )

from schemas.room_schemas import (
                                    UpdateRoomRequest,
                                    UpdateRoomPatientRequest
                                  )
from devices.fetch_devices import fetch_devices_by_room_id
from schemas.device_schemas import UpdateDeviceUpdateAtRequest
from devices.update_device_updated_at import update_device_updated_at

def update_room_transaction(
                              room: UpdateRoomRequest,
                              hospital_id: str
                            ):

    print("update room transaction")
    return update_room(
                         room=room,
                         hospital_id=hospital_id
                       )


def update_room_patientname_transaction(
                                          room: UpdateRoomPatientRequest,
                                          hospital_id: str,
                                          user_id:str
                                        ):

    print("update room patientname transaction")
    #特定のroom id内のdevicesを抽出
    room_devices = fetch_devices_by_room_id(
                                            room_id=room.id,
                                            hospital_id=hospital_id
                                        )
    #特定のroom id内のdevicesのupdate atを更新
    for device in room_devices:
        update_device_updated_at(
                                  device=UpdateDeviceUpdateAtRequest(id=device["id"]),
                                  hospital_id=hospital_id,
                                  user_id=user_id
                                )
    return update_room_patientname(
                                     room=room,
                                     hospital_id=hospital_id
                                   )