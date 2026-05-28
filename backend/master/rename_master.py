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

    print("rename response")

    for row in response.data:
        print(f"・{row}")

        return response.data[0]

def rename_device_model(
                        device_model_id: int,
                        name: str,
                        ):

    print("rename device_model")

    response = (
        supabase
        .table("device_models")
        .update({
            "name": name,
        })
        .eq(
            "id",
            device_model_id
        )
        .execute()
    )

    print("rename response")

    for row in response.data:
        print(f"・{row}")

        return response.data[0]
