from wards.update_ward import update_ward_info
from wards.fetch_wards import fetch_ward
from schemas.ward_schemas import UpdateWardInfoRequest
from transactions.ward_infections.update_ward_infections_transaction import (
    update_ward_infections_transaction
)
from schemas.ward_infection_schemas import (UpdateWardInfectionsRequest)
def update_ward_info_transaction(
    ward: UpdateWardInfoRequest,
    hospital_id: str
):
    #status,note更新
    update_ward_info(
        ward=ward,
        hospital_id=hospital_id
    )
    #ward infection更新
    update_ward_infections_transaction(
        UpdateWardInfectionsRequest(
            ward_id=ward.id,
            infection_type_ids=ward.infection_type_ids,
        ),
        hospital_id
    )

    return fetch_ward(
        ward_id=ward.id,
        hospital_id=hospital_id
    )