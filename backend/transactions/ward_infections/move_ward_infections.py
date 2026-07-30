from ward_infections.fetch_ward_infections import (
    fetch_ward_infections_by_ward_id
)
from ward_infections.delete_ward_infections import (
    delete_ward_infections_by_ward_id
)
from ward_infections.add_ward_infection import add_ward_infection

from schemas.ward_infection_schemas import AddWardInfectionRequest


def move_ward_infections(
    from_ward_id: int,
    to_ward_id: int,
    hospital_id: str
):

    print("move_ward_infections")

    infections = fetch_ward_infections_by_ward_id(
        ward_id=from_ward_id,
        hospital_id=hospital_id
    )

    print("infections")
    for infection in infections:
        print(infection)

    delete_ward_infections_by_ward_id(
        ward_id=from_ward_id,
        hospital_id=hospital_id
    )

    for infection in infections:
        add_ward_infection(
            ward_infection=AddWardInfectionRequest(
                ward_id=to_ward_id,
                infection_type_id=infection["infection_type_id"]
            ),
            hospital_id=hospital_id
        )