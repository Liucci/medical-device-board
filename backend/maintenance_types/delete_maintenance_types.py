from common.supabase_client import (
    supabase
)

def delete_maintenance_type(maintenance_type_id: int):

    print("delete_maintenance_type")
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

    return response.data[0]
