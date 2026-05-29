from common.supabase_client import (
    supabase
)

def delete_device(device_id: int):

    print(f"delete device_id: {device_id}")
    
    response = (
    supabase
    .table("devices")
    .delete()
    .eq(
        "id",
        device_id
    )
    .execute()
    )

    return response.data[0]
