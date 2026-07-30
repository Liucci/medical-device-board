from ward_infections.delete_ward_infections import delete_ward_infections
from schemas.ward_infection_schemas import DeleteWardInfectionsRequest


def delete_ward_infections_transaction(
    ward_infection: DeleteWardInfectionsRequest,
    hospital_id: str
):

    print("delete_ward_infections_transaction")

    delete_ward_infections(
        ward_infection,
        hospital_id
    )