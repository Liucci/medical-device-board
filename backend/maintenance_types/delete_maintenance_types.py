from common.supabase_client import (
    supabase
)

def delete_maintenance_type(
                            maintenance_type_id: int
                            ):

    print(f"delete maintenance_type_id: {maintenance_type_id}")

    response = (
        supabase
        .table("maintenance_types")
        .delete()
        .eq(
            "id",
            maintenance_type_id
        )
        .execute()
    )

    print("delete response")

    for row in response.data:
        print(f"・{row}")

    return {
            "success": True,
            "maintenance_type": response.data[0]
            }