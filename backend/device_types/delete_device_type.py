from common.supabase_client import (
    supabase
)

def delete_device_type(device_type_id: int):
    print(f"delete device_type")
    response = (
        supabase
        .table("device_types")
        .delete()
        .eq(
            "id",
            device_type_id
        )
        .execute()
    )
    return response.data[0]

