from common.supabase_client import (
    supabase
)

def delete_device_type(
                       device_type_id: int
                       ):

    print(f"delete device_type_id: {device_type_id}")

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

    print("delete response")

    for row in response.data:
        print(f"・{row}")

    return {
            "success": True,
            "device_type": response.data[0]
            }

def delete_device_model(
                        device_model_id: int
                        ):

    print(f"delete device_model_id: {device_model_id}")

    response = (
        supabase
        .table("device_models")
        .delete()
        .eq(
            "id",
            device_model_id
        )
        .execute()
    )

    print("delete response")

    for row in response.data:
        print(f"・{row}")

    return {
            "success": True,
            "device_model": response.data[0]
            }