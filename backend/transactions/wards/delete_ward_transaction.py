from wards.delete_wards import delete_ward
from schemas.ward_schemas import DeleteWardRequest

from rooms.delete_rooms import (delete_rooms_by_ward_id)

def delete_ward_transaction(
                                ward: DeleteWardRequest,
                                hospital_id: str
                            ):
    print("delete_ward_transaction")

    delete_rooms_by_ward_id(
                             ward=ward,
                            hospital_id=hospital_id
                            )

    delete_ward(
                    ward=ward,
                    hospital_id=hospital_id
                )