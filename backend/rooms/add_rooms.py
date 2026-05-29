from common.supabase_client import (
    supabase
)

from schemas.room_schemas import (
    AddRoomRequest
)

def add_room(room: AddRoomRequest):
    print("insert room")
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
    return response.data[0]
        
