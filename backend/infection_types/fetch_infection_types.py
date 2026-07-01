from common.supabase_client import supabase

def fetch_infection_types(hospital_id: str):
    print("fetch_infection_types")

    response = (
        supabase
        .table("infection_types")
        .select("*")
        .eq("hospital_id", hospital_id)
        .execute()
    )

    return response.data


def fetch_infection_type(
                            infection_type_id: int,
                            hospital_id: str
                        ):

    print("fetch_infection_type")

    response = (
        supabase
        .table("infection_types")
        .select("*")
        .eq("id", infection_type_id)
        .eq("hospital_id", hospital_id)
        .single()
        .execute()
    )

    return response.data