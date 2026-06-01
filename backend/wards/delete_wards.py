from common.supabase_client import (supabase)
from schemas.ward_schemas import (DeleteWardsRequest)

def delete_ward(ward: DeleteWardsRequest,
                hospital_id:str
                ):
    print("delete ward_id")
    response = (
                supabase
                .table("wards")
                .delete()
                .in_("id", ward.ids)
                .eq("hospital_id", hospital_id)
                
                .execute()
            )
