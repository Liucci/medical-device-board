from common.supabase_client import (
    supabase
)

def delete_room(
                room_id: int
                ):

    print(f"delete room_id: {room_id}")

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

    print("delete response")

    for row in response.data:
        print(f"・{row}")

    return {
            "success": True,
            "room": response.data[0]
            }