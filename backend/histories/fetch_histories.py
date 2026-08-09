from supabase import Client


def fetch_device_histories(
                            client:Client,
                            hospital_id: str
                          ):
    print("fetch_device_histories")
    response = (
                client
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