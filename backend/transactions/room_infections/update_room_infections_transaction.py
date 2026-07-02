from room_infections.add_room_infection import add_room_infection
from room_infections.delete_room_infections import delete_room_infections_by_room_id
from room_infections.fetch_room_infections import fetch_room_infections_by_room_id
from schemas.room_infection_schemas import AddRoomInfectionRequest,UpdateRoomInfectionsRequest

def update_room_infections_transaction(room_infection: UpdateRoomInfectionsRequest, 
                                       hospital_id: str):

    print("update_room_infections_transaction")
    #まずroomIdに紐づく感染症を削除
    delete_room_infections_by_room_id(room_infection.room_id, 
                                      hospital_id)

    for infection_type_id in room_infection.infection_type_ids:
        add_room_infection(AddRoomInfectionRequest(
                                                    room_id=room_infection.room_id, 
                                                    infection_type_id=infection_type_id
                                                    ),
                                                    hospital_id)

    return fetch_room_infections_by_room_id(room_infection.room_id,
                                            hospital_id)