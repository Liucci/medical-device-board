from common.supabase_client import (
    supabase
)

def delete_device(
                  device_id: int
                  ):

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

    print("delete response")

    for row in response.data:
        print(f"・{row}")

    return {
            "success": True,
            "device": response.data[0]
            }