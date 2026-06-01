# transactions/create_ward_transaction.py

from wards.add_ward import add_ward
from schemas.ward_schemas import (AddWardRequest)
def create_ward_transaction(
                                ward:AddWardRequest,
                                hospital_id
                            ):
    add_ward(
            hospital_id=hospital_id,
            ward=ward
            )

