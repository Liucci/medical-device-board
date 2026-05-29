from common.supabase_client import (
    supabase
)

def delete_ward(ward_id: int):
    print("delete ward_id")
    response = (
        supabase
        .table("wards")
        .delete()
        .eq(
            "id",
            ward_id
        )
        .execute()
    )
    return  response.data[0]
