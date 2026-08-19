from supabase import Client
from schemas.ward_infection_schemas import DeleteWardInfectionsRequest


def delete_ward_infections(
                            client:Client,
                            ward_infection: DeleteWardInfectionsRequest,
                            hospital_id: str
                        ):

    print("delete ward_infections")

    (
        client
        .table("ward_infections")
        .delete()
        .in_("id", ward_infection.ids)
        .eq("hospital_id", hospital_id)
        .execute()
    )


def delete_ward_infections_by_ward_id(
                                        client:Client,
                                        ward_id: int,
                                        hospital_id: str
                                    ):

    print("delete_ward_infections_by_ward_id")
    #print("ward_id =", ward_id)
    #print("hospital_id =", hospital_id)

    response = (
        client
        .table("ward_infections")
        .delete()
        .eq("ward_id", ward_id)
        .eq("hospital_id", hospital_id)
        .execute()
    )

    print(response.data)