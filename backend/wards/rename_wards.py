from common.supabase_client import (
    supabase
)

def rename_ward(
                ward_id: int,
                name: str,
                ):

    print(f"rename ward_id: {ward_id}")
    print(f"name: {name}")

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

    print("rename response")

    for row in response.data:
        print(f"・{row}")

    return {
            "success": True,
            "ward": response.data[0]
            }