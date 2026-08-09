from supabase import Client
from schemas.ward_schemas import (AddWardRequest)

def add_ward(
            client:Client,
            ward: AddWardRequest,
            hospital_id: str,
            display_order: int              
        ):

    print("insert ward")

    (
        client
        .table("wards")
        .insert({
                 "hospital_id": hospital_id,
                 "name": ward.name,
                 "display_order": display_order
                })
        .execute()
    )

