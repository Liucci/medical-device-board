from fastapi import HTTPException

from exists.exists_devices_in_rooms import (
    exists_devices_in_rooms
)
from rooms.delete_rooms import delete_rooms
from schemas.room_schemas import DeleteRoomsRequest

def delete_room_transaction(
                              room: DeleteRoomsRequest,
                              hospital_id: str
                            ):

    print("delete room transaction")
    if exists_devices_in_rooms(
        room.ids,
        hospital_id
    ):
      raise HTTPException(
        status_code=400,
        detail="機器が配置されている部屋は削除できません。"
      )



    delete_rooms(
                  room=room,
                  hospital_id=hospital_id
                )