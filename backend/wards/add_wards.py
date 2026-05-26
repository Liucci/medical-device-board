from common.supabase_client import (
    supabase
)

from schemas.ward_schemas import (
    AddWardRequest
)

def add_ward(
             ward: AddWardRequest
             ):

    print("insert ward")

    for key, value in ward.dict().items():
        print(f"・{key}: {value}")

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

    print("insert response")

    for row in response.data:
        print(f"・{row}")

    return {
            "success": True,
            "ward": response.data[0]
            }