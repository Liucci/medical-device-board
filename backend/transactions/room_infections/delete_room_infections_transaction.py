from room_infections.delete_room_infections import delete_room_infections
from schemas.room_infection_schemas import DeleteRoomInfectionsRequest

def delete_room_infections_transaction(
                                        room_infection: DeleteRoomInfectionsRequest,
                                        hospital_id: str
                                      ):

    print("delete_room_infections_transaction")

    delete_room_infections(
                            room_infection,
                            hospital_id
                          )