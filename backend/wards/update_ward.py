from common.supabase_client import (
    supabase
)

def update_ward(
                ward_id: int,
                name: str,
                hospital_id:str
                ):

    print(f"rename ward")

    response = (
                supabase
                .table("wards")
                .update({"name": name,})
                .eq("id",ward_id)
                .eq("hospital_id", hospital_id)
                .execute()
                )
    return  response.data[0]
