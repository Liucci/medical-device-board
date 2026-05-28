from common.supabase_client import (
    supabase
)


def fetch_device_types(hospital_id: str):
    print("fetch_device_types")
    try:

        response = (
            supabase
            .table("device_types")
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
            f"fetch_device_types error: "
            f"{e}"
        )

        return []
    
def fetch_device_models(hospital_id: str):
    print("fetch_device_models")
    try:

        response = (
            supabase
            .table("device_models")
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
            f"fetch_device_models error: "
            f"{e}"
        )

        return []