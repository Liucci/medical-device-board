from common.supabase_client import (
    supabase
)

def delete_room(room_id: int):
    print("delete room")
    response = (
            supabase
            .table("rooms")
            .delete()
            .eq(
                "id",
                room_id
            )
            .execute()
        )
    return response.data[0]

def delete_rooms_by_ward_ids(
                                ward_ids: list[int],
                                hospital_id: str
                             ):

    print("delete rooms by ward ids")

    (
        supabase
        .table("rooms")
        .delete()
        .in_("ward_id", ward_ids)
        .eq("hospital_id", hospital_id)
        .execute()
    )