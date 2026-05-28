from common.supabase_client import (
    supabase
)

def delete_room(
                room_id: int
                ):

    print("delete room")
    try:
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
            return response.data[0]
    except Exception as e:
        print(
            f"delete_room error: "
            f"{e}"
        )
        return []