from wards.delete_wards import delete_ward
from schemas.ward_schemas import DeleteWardsRequest

from rooms.delete_rooms import (delete_rooms_by_ward_ids)

def delete_wards_transaction(
                                ward: DeleteWardsRequest,
                                hospital_id: str
                            ):

    delete_rooms_by_ward_ids(
                                ward_ids=ward.ids,
                                hospital_id=hospital_id
                             )

    delete_ward(
                    ward=ward,
                    hospital_id=hospital_id
                )