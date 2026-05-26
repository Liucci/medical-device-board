from common.supabase_client import (
    supabase
)

def delete_ward(
                ward_id: int
                ):

    print(f"delete ward_id: {ward_id}")

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

    print("delete response")

    for row in response.data:
        print(f"・{row}")

    return {
            "success": True,
            "ward": response.data[0]
            }