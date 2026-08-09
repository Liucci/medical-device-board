from supabase import Client
from rooms.add_rooms import add_room
from schemas.room_schemas import AddRoomRequest

def create_room_transaction(
                            client:Client,
                            room: AddRoomRequest,
                            hospital_id:str
             ):
    
    print("insert room")
    add_room(
             client,
             room,
             hospital_id
             )
