from common.supabase_admin_client import (supabase)
from schemas.ward_schemas import (AddWardRequest)

def add_ward(ward: AddWardRequest,
              hospital_id: str,
              display_order: int              
            ):

    print("insert ward")

    response = (
        supabase
        .table("wards")
        .insert({
                 "hospital_id": hospital_id,
                 "name": ward.name,
                 "display_order": display_order
                })
        .execute()
    )

