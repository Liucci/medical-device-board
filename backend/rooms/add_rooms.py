from supabase import Client


from schemas.room_schemas import (
    AddRoomRequest
)
#ward_idと紐づけるため、ward_idは必要パラメータ
def add_room(
             client:Client,
             room: AddRoomRequest,
             hospital_id:str
             ):
    
    print("insert room")
    response = (
                client
                .table("rooms")
                .insert({
                    "hospital_id":hospital_id,
                    "ward_id":room.ward_id,
                    "name":room.name,

                })
                .execute()
    )
    return response.data[0]
        
