from infection_types.add_infection_type import add_infection_type
from schemas.infection_type_schemas import AddInfectionTypeRequest

def create_infection_type_transaction(
                                        infection_type: AddInfectionTypeRequest,
                                        hospital_id: str
                                     ):

    print("create_infection_type_transaction")

    return add_infection_type(
                                infection_type=infection_type,
                                hospital_id=hospital_id
                             )