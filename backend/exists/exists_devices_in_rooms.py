from common.supabase_client import supabase

#複数room内にdeviceが存在するか判定
def exists_devices_in_rooms(
    room_ids: list[int],
    hospital_id: str
) -> bool:
    print("exists_devices_in_rooms")

    response = (
        supabase
        .table("devices")
        .select("id")
        .eq("hospital_id", hospital_id)
        .eq("status", "room")
        .in_("room_id", room_ids)
        .limit(1)
        .execute()
    )

    return bool(response.data)