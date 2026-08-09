from supabase import Client


def fetch_rooms(
                client:Client,
                hospital_id: str
                ):
    print("fetch_rooms")
    response = (
                    client
                    .table("rooms")
                    .select("*")
                    .eq(
                        "hospital_id",
                        hospital_id
                    )
                    .execute()
                )
    return response.data


def fetch_room(
                client:Client,
                room_id: int,
                hospital_id: str
              ):

    print("fetch_room")

    response = (
                    client
                    .table("rooms")
                    .select("*")
                    .eq("id", room_id)
                    .eq("hospital_id", hospital_id)
                    .single()
                    .execute()
               )

    return response.data