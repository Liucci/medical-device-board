from common.supabase_client import supabase
from backend.schemas.infection_type_schemas import AddRoomInfectionRequest

def add_room_infection(
                        room_infection: AddRoomInfectionRequest,
                        hospital_id: str
                      ):

    print("insert room_infection")

    response = (
        supabase
        .table("room_infections")
        .insert({
            "hospital_id": hospital_id,
            "room_id": room_infection.room_id,
            "infection_type_id": room_infection.infection_type_id
        })
        .execute()
    )

    return response.data[0]