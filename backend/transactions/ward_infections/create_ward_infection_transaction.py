from ward_infections.add_ward_infection import add_ward_infection
from schemas.ward_infection_schemas import AddWardInfectionRequest
from supabase import Client


def create_ward_infection_transaction(
                                    client:Client,
                                    ward_infection: AddWardInfectionRequest,
                                    hospital_id: str
):

    print("create_ward_infection_transaction")

    return add_ward_infection(
                                client=client, 
                                ward_infection=ward_infection,
                                hospital_id=hospital_id
                            )