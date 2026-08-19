from supabase import Client


def fetch_ward_infections(
                        client:Client,
                        hospital_id: str
                        ):
    print("fetch_ward_infections")

    response = (
        client
        .table("ward_infections")
        .select("*")
        .eq("hospital_id", hospital_id)
        .execute()
    )

    return response.data


def fetch_ward_infections_by_ward_id(
                                    client:Client,
                                    ward_id: int,
                                    hospital_id: str
                                ):

    print("fetch_ward_infections_by_ward_id")

    response = (
        client
        .table("ward_infections")
        .select("*")
        .eq("ward_id", ward_id)
        .eq("hospital_id", hospital_id)
        .execute()
    )

    return response.data