from supabase import Client


def exists_devices_in_ward(
    client:Client,
    ward_id: int,
    hospital_id: str
) -> bool:
    print("exists_devices_in_ward")
    response = (
        client
        .table("devices")
        .select("id, rooms!inner(id)")
        .eq("hospital_id", hospital_id)
        .eq("status", "room")
        .eq("rooms.ward_id", ward_id)
        .limit(1)
        .execute()
    )

    return bool(response.data)