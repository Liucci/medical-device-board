from common.supabase_client import (
    supabase
)

def fetch_histories(hospital_id: str):
    try:
        response = (
            supabase
            .table("device_histories")
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
            f"fetch_histories error: "
            f"{e}"
        )
        return []