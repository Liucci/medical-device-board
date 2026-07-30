from common.supabase_admin_client import supabase


def fetch_ward_infections(hospital_id: str):
    print("fetch_ward_infections")

    response = (
        supabase
        .table("ward_infections")
        .select("*")
        .eq("hospital_id", hospital_id)
        .execute()
    )

    return response.data


def fetch_ward_infections_by_ward_id(
    ward_id: int,
    hospital_id: str
):

    print("fetch_ward_infections_by_ward_id")

    response = (
        supabase
        .table("ward_infections")
        .select("*")
        .eq("ward_id", ward_id)
        .eq("hospital_id", hospital_id)
        .execute()
    )

    return response.data