from supabase import Client


def fetch_hospital_settings(client:Client,
                            hospital_id: str):

    print("fetch_hospital_settings")

    response = (
                    client
                    .table("hospital_settings")
                    .select("*")
                    .eq("hospital_id", hospital_id)
                    .maybe_single()
                    .execute()
               )
    if response is None:
        return None
    return response.data