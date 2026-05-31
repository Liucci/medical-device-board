from common.supabase_client import (
    supabase
)

def delete_ward(ids: list[int],
                hospital_id:str
                ):
    print("delete ward_id")
    response = (
        supabase
        .table("wards")
        .delete()
        .in_("ids", ids)
        .eq("hospital_id", hospital_id)
        
        .execute()
    )
    return  response.data
