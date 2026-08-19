from common.supabase_admin_client import supabase
from supabase import Client

def fetch_infection_types(client:Client,
                          hospital_id: str):
    print("fetch_infection_types")

    response = (
        client
        .table("infection_types")
        .select("*")
        .eq("hospital_id", hospital_id)
        .execute()
    )

    return response.data


def fetch_infection_type(
                            client:Client,
                            infection_type_id: int,
                            hospital_id: str
                        ):

    print("fetch_infection_type")

    response = (
        client
        .table("infection_types")
        .select("*")
        .eq("id", infection_type_id)
        .eq("hospital_id", hospital_id)
        .single()
        .execute()
    )
    print("infection_type:",response)
    return response.data