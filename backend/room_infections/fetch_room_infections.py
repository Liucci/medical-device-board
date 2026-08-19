from supabase import Client

def fetch_room_infections(client:Client,
                          hospital_id: str):
    print("fetch_room_infections")

    response = (
        client
        .table("room_infections")
        .select("*")
        .eq("hospital_id", hospital_id)
        .execute()
    )

    return response.data


def fetch_room_infections_by_room_id(
                                        client:Client,
                                        room_id: int,
                                        hospital_id: str
                                    ):

    print("fetch_room_infection")

    response = (
                client
                .table("room_infections")
                .select("*")
                .eq("room_id", room_id)
                .eq("hospital_id", hospital_id)
                .execute()
    )

    return response.data