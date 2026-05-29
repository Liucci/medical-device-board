from common.supabase_client import (
    supabase
)

from schemas.ward_schemas import (
    AddWardRequest
)

def add_ward(ward: AddWardRequest):
    print("insert ward")
    response = (
        supabase
        .table("wards")
        .insert({
            "hospital_id":
                ward.hospital_id,

            "name":
                ward.name
        })
        .execute()
    )
    return  response.data[0]
           