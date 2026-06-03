from common.supabase_client import (supabase)
from rooms.add_rooms import add_room
from schemas.room_schemas import AddRoomRequest

def create_room_transaction(room: AddRoomRequest,
             hospital_id:str):
    
    print("insert room")
    add_room(room,
             hospital_id)
