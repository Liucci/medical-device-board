from infection_types.add_infection_type import add_infection_type
from schemas.infection_type_schemas import AddInfectionTypeRequest
from supabase import Client

def create_infection_type_transaction(
                                        client:Client,
                                        infection_type: AddInfectionTypeRequest,
                                        hospital_id: str
                                     ):

    print("create_infection_type_transaction")

    return add_infection_type(
                                 client=client,
                                 infection_type=infection_type,
                                hospital_id=hospital_id
                             )