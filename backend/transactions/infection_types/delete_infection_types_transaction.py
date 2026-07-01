from infection_types.delete_infection_types import delete_infection_types
from schemas.infection_type_schemas import DeleteInfectionTypesRequest

def delete_infection_types_transaction(
                                        infection_type: DeleteInfectionTypesRequest,
                                        hospital_id: str
                                      ):

    print("delete_infection_types_transaction")

    delete_infection_types(
                            infection_type,
                            hospital_id
                          )