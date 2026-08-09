from infection_types.update_infection_type import update_infection_type
from schemas.infection_type_schemas import UpdateInfectionTypeRequest
from supabase import Client

def update_infection_type_transaction(
                                        client:Client,
                                        infection_type: UpdateInfectionTypeRequest,
                                        hospital_id: str
                                     ):

    print("update_infection_type_transaction")

    return update_infection_type(
                                    client, 
                                    infection_type,
                                    hospital_id
                                )