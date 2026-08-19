from supabase import Client
from schemas.room_infection_schemas import AddRoomInfectionRequest

def add_room_infection(
                        client:Client,
                        room_infection: AddRoomInfectionRequest,
                        hospital_id: str
                      ):

    print("insert room_infection")

    response = (
        client
        .table("room_infections")
        .insert({
            "hospital_id": hospital_id,
            "room_id": room_infection.room_id,
            "infection_type_id": room_infection.infection_type_id
        })
        .execute()
    )

    return response.data[0]