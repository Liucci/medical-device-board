from wards.update_ward import (update_ward)
from schemas.ward_schemas import (UpdateWardRequest)

def update_ward_transaction(
                                ward: UpdateWardRequest,
                                hospital_id: str
                            ):

    print("update_ward_transaction")

    update_ward(
                    ward=ward,
                    hospital_id=hospital_id
                )