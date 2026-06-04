from common.supabase_client import (
    supabase
)

def rename_device_type(
                       device_type_id: int,
                       name: str,
                       ):
    print("rename device_type")
    response = (
        supabase
        .table("device_types")
        .update({
            "name": name,
        })
        .eq(
            "id",
            device_type_id
        )
        .execute()
    )
    return response.data[0]

