# transactions/create_ward_transaction.py

from wards.add_ward import add_ward
from schemas.ward_schemas import (AddWardRequest)
from wards.fetch_wards import get_max_ward_display_order

def create_ward_transaction(
                                ward:AddWardRequest,
                                hospital_id
                            ):
    print("create_ward_transaction")
    display_order =get_max_ward_display_order(hospital_id) + 1

    add_ward(
            hospital_id=hospital_id,
            ward=ward,
            display_order=display_order
            )

