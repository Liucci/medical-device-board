from common.supabase_client import (supabase)
from schemas.ward_schemas import (AddWardRequest)

def add_ward(
              hospital_id: str,
              ward: AddWardRequest
            ):

    print("insert ward")

    response = (
        supabase
        .table("wards")
        .insert({
                 "hospital_id": hospital_id,
                 "name": ward.name
                })
        .execute()
    )

