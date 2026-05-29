from common.supabase_client import (
    supabase
)

def rename_ward(
                ward_id: int,
                name: str,
                ):

    print(f"rename ward")

    response = (
        supabase
        .table("wards")
        .update({
            "name": name,
        })
        .eq(
            "id",
            ward_id
        )
        .execute()
    )
    return  response.data[0]
