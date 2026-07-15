from common.supabase_admin_client import (
    supabase
)

from schemas.room_schemas import (
    AddRoomRequest
)
#ward_idと紐づけるため、ward_idは必要パラメータ
def add_room(room: AddRoomRequest,
             hospital_id:str):
    
    print("insert room")
    response = (
            supabase
            .table("rooms")
            .insert({
                "hospital_id":hospital_id,
                "ward_id":room.ward_id,
                "name":room.name,

            })
            .execute()
        )
    return response.data[0]
        
