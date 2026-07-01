from infection_types.update_infection_type import update_infection_type
from schemas.infection_type_schemas import UpdateInfectionTypeRequest

def update_infection_type_transaction(
                                        infection_type: UpdateInfectionTypeRequest,
                                        hospital_id: str
                                     ):

    print("update_infection_type_transaction")

    return update_infection_type(
                                    infection_type,
                                    hospital_id
                                )