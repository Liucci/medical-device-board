from common.supabase_client import (
    supabase
)

from schemas.room_schemas import (
    AddRoomRequest
)

def add_room(
             room: AddRoomRequest
             ):

    print("insert room")

    for key, value in room.dict().items():
        print(f"・{key}: {value}")

    response = (
        supabase
        .table("rooms")
        .insert({
            "hospital_id":
                room.hospital_id,

            "ward_id":
                room.ward_id,

            "name":
                room.name,

            "patient_name":
                room.patient_name,

            "created_by":
                room.created_by,

            "updated_by":
                room.updated_by
        })
        .execute()
    )

    print("insert response")

    for row in response.data:
        print(f"・{row}")

    return {
            "success": True,
            "room": response.data[0]
            }