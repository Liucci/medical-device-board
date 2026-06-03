from common.supabase_client import (supabase)
from schemas.ward_schemas import (DeleteWardRequest)

def delete_ward(ward: DeleteWardRequest,
                hospital_id:str
                ):
    print("delete ward_id")
    response = (
                supabase
                .table("wards")
                .delete()
                .eq("id", ward.id)
                .eq("hospital_id", hospital_id)
                
                .execute()
            )
