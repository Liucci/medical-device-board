from common.supabase_client import supabase
from schemas.room_infection_schemas import DeleteRoomInfectionsRequest

def delete_room_infections(
                            room_infection: DeleteRoomInfectionsRequest,
                            hospital_id: str
                          ):

    print("delete room_infections")

    (
        supabase
        .table("room_infections")
        .delete()
        .in_("id", room_infection.ids)
        .eq("hospital_id", hospital_id)
        .execute()
    )


def delete_room_infections_by_room_id(
    room_id: int,
    hospital_id: str
):
    print("delete_room_infections_by_room_id")
    print("room_id =", room_id)
    print("hospital_id =", hospital_id)


    response= (
        supabase
        .table("room_infections")
        .delete()
        .eq("room_id", room_id)
        .eq("hospital_id", hospital_id)
        .execute()
    )
    print(response.data)