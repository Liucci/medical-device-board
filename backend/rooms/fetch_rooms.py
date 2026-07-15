from common.supabase_admin_client import (
    supabase
)

def fetch_rooms(hospital_id: str):
    print("fetch_rooms")
    response = (
                    supabase
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
                room_id: int,
                hospital_id: str
              ):

    print("fetch_room")

    response = (
                    supabase
                    .table("rooms")
                    .select("*")
                    .eq("id", room_id)
                    .eq("hospital_id", hospital_id)
                    .single()
                    .execute()
               )

    return response.data