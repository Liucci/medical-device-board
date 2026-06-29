from fastapi import HTTPException
from wards.delete_wards import delete_ward
from schemas.ward_schemas import DeleteWardRequest

from rooms.delete_rooms import (delete_rooms_by_ward_id)
from exists.exists_devices_in_ward import exists_devices_in_ward

def delete_ward_transaction(
                                ward: DeleteWardRequest,
                                hospital_id: str
                            ):
    print("delete_ward_transaction")

    if exists_devices_in_ward(
                                ward.id,
                                hospital_id
                            ):
        raise HTTPException(
            status_code=400,
            detail="病棟内に機器が存在するため削除できません。"
        )

    delete_rooms_by_ward_id(
                             ward=ward,
                            hospital_id=hospital_id
                            )
    print("after delete_rooms")
    delete_ward(
                    ward=ward,
                    hospital_id=hospital_id
                )
    print("after delete_ward")
