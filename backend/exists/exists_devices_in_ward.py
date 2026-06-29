from common.supabase_client import supabase


def exists_devices_in_ward(
    ward_id: int,
    hospital_id: str
) -> bool:
    print("exists_devices_in_ward")
    response = (
        supabase
        .table("devices")
        .select("id, rooms!inner(id)")
        .eq("hospital_id", hospital_id)
        .eq("status", "room")
        .eq("rooms.ward_id", ward_id)
        .limit(1)
        .execute()
    )

    return bool(response.data)