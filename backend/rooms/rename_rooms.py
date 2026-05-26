from common.supabase_client import (
    supabase
)

def rename_room(
                room_id: int,
                name: str,
                patient_name: str | None = None
                ):

    print(f"rename room_id: {room_id}")
    print(f"name: {name}")
    print(f"patient_name: {patient_name}")

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

    print("rename response")

    for row in response.data:
        print(f"・{row}")

    return {
            "success": True,
            "room": response.data[0]
            }