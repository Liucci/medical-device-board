from common.supabase_client import supabase

def fetch_room_infections(hospital_id: str):
    print("fetch_room_infections")

    response = (
        supabase
        .table("room_infections")
        .select("*")
        .eq("hospital_id", hospital_id)
        .execute()
    )

    return response.data


def fetch_room_infections_by_room_id(
                            room_id: int,
                            hospital_id: str
                        ):

    print("fetch_room_infection")

    response = (
        supabase
        .table("room_infections")
        .select("*")
        .eq("room_id", room_id)
        .eq("hospital_id", hospital_id)
        .execute()
    )

    return response.data