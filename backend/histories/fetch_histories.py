from common.supabase_admin_client import supabase


def fetch_device_histories(
                                hospital_id: str
                          ):
    print("fetch_device_histories")
    response = (
        supabase
        .table("device_histories")
        .select("*")
        .eq(
                "hospital_id",
                hospital_id
            )
        .order(
                "created_at",
                desc=True
            )
        .execute()
    )

    return response.data