from supabase import Client
from schemas.room_infection_schemas import DeleteRoomInfectionsRequest

def delete_room_infections(
                            client:Client,
                            room_infection: DeleteRoomInfectionsRequest,
                            hospital_id: str
                          ):

    print("delete room_infections")

    (
        client
        .table("room_infections")
        .delete()
        .in_("id", room_infection.ids)
        .eq("hospital_id", hospital_id)
        .execute()
    )


def delete_room_infections_by_room_id(
                                        client:Client,
                                        room_id: int,
                                        hospital_id: str
                                    ):
    print("delete_room_infections_by_room_id")
    # print("room_id =", room_id)
    # print("hospital_id =", hospital_id)


    (
        client
        .table("room_infections")
        .delete()
        .eq("room_id", room_id)
        .eq("hospital_id", hospital_id)
        .execute()
    )
