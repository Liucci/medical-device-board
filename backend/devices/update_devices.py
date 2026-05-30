from common.supabase_client import (
    supabase
)

def update_device(
                  device_id: int,
                  name: str
                  ):

    print("rename device")

    response = (
        supabase
        .table("devices")
        .update({
            "name": name
        })
        .eq(
            "id",
            device_id
        )
        .execute()
    )

    return response.data[0]