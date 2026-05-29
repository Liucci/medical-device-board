from common.supabase_client import (
    supabase
)

def rename_maintenance_type(
                            maintenance_type_id: int,
                            name: str
                            ):
    print("rename_maintenance_type")
    response = (
        supabase
        .table("maintenance_types")
        .update({
            "name": name
        })
        .eq(
            "id",
            maintenance_type_id
        )
        .execute()
    )
    return response.data[0]
