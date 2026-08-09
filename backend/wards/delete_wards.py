from supabase import Client
from schemas.ward_schemas import (DeleteWardRequest)

def delete_ward(
                client:Client,
                ward: DeleteWardRequest,
                hospital_id:str
                ):
    print("delete ward_id")
    (
        client
        .table("wards")
        .delete()
        .eq("id", ward.id)
        .eq("hospital_id", hospital_id)
        
        .execute()
    )
