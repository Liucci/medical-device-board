from supabase import Client
from schemas.ward_infection_schemas import AddWardInfectionRequest


def add_ward_infection(
                        client:Client,
                        ward_infection: AddWardInfectionRequest,
                        hospital_id: str
                    ):

    print("insert ward_infection")

    response = (
        client
        .table("ward_infections")
        .insert({
            "hospital_id": hospital_id,
            "ward_id": ward_infection.ward_id,
            "infection_type_id": ward_infection.infection_type_id
        })
        .execute()
    )

    return response.data[0]