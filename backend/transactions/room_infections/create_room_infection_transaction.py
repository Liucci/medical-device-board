from room_infections.add_room_infection import add_room_infection
from schemas.room_infection_schemas import AddRoomInfectionRequest

def create_room_infection_transaction(
                                        room_infection: AddRoomInfectionRequest,
                                        hospital_id: str
                                     ):

    print("create_room_infection_transaction")

    return add_room_infection(
                                room_infection=room_infection,
                                hospital_id=hospital_id
                             )