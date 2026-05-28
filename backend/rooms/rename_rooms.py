from common.supabase_client import (
    supabase
)

def rename_room(
                room_id: int,
                name: str,
                patient_name: str | None = None
                ):
    print("rename room")
    try:
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

            return response.data[0]
    except Exception as e:
        print(
            f"rename_room error: "
            f"{e}"
        )
        return []