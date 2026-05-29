from common.supabase_client import (
    supabase
)

def rename_room(
                room_id: int,
                name: str,
                patient_name: str | None = None
                ):
    print("rename room")
    response = (
            supabase
            .table("rooms")
            .update({
                "name": name,
                "patient_name": patient_name
            })
            .eq(
                "id",
                room_id
            )
            .execute()
        )
    return response.data[0]
