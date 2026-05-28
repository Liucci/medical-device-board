from common.supabase_client import (
    supabase
)

def fetch_rooms(hospital_id: str):
    print("fetch_rooms")
    try:
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
    except Exception as e:
        print(
            f"fetch_rooms error: "
            f"{e}"
        )
        return []