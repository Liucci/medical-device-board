from common.supabase_client import (
    supabase
)

def delete_device(device_id: int):

    print(f"delete device_id: {device_id}")
    try:
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
        return response.data[0]
    except Exception as e:
        print(
            f"delete_device error: "
            f"{e}"
        )
        return []