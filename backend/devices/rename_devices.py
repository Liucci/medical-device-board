from common.supabase_client import (
    supabase
)

def rename_device(
                  device_id: int,
                  name: str
                  ):

    print(f"rename device_id: {device_id}")
    print(f"name: {name}")

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

    print("rename response")

    for row in response.data:
        print(f"・{row}")

    return response.data[0]