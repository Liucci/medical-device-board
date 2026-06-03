from rooms.delete_rooms import delete_rooms
from schemas.room_schemas import DeleteRoomsRequest

def delete_room_transaction(
                              room: DeleteRoomsRequest,
                              hospital_id: str
                            ):

    print("delete room transaction")

    delete_rooms(
                  room=room,
                  hospital_id=hospital_id
                )