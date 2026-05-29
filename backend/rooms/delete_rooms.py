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
