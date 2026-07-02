from room_infections.fetch_room_infections import fetch_room_infections_by_room_id
from room_infections.delete_room_infections import delete_room_infections_by_room_id
from room_infections.add_room_infection import add_room_infection
from schemas.room_infection_schemas import AddRoomInfectionRequest


def move_room_infections(
                            from_room_id: int,
                            to_room_id: int,
                            hospital_id: str
                        ):

    print("move_room_infections")

    infections = fetch_room_infections_by_room_id(
                                                    room_id=from_room_id,
                                                    hospital_id=hospital_id
                                                  )
    print("infections")
    for infection in infections:
      print(infection)
      
    delete_room_infections_by_room_id(
                                        room_id=from_room_id,
                                        hospital_id=hospital_id
                                     )

    for infection in infections:
        add_room_infection(
                room_infection=AddRoomInfectionRequest(
                                              room_id=to_room_id,
                                              infection_type_id=infection["infection_type_id"]                                                                 ),
                hospital_id=hospital_id
              )
        