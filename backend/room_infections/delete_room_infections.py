from common.supabase_client import supabase
from backend.schemas.infection_type_schemas import DeleteRoomInfectionsRequest

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