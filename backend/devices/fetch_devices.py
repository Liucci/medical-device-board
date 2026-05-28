from common.supabase_client import (
    supabase
)

def fetch_devices(hospital_id: int):
    print("fetch_devices")
    try:
        response = (
            supabase
            .table("devices")
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
            f"fetch_devices error: "
            f"{e}"
        )

        return []
    