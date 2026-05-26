from common.supabase_client import (
    supabase
)

def rename_device_type(
                       device_type_id: int,
                       name: str,
                       color: str | None = None,
                       icon: str | None = None
                       ):

    print(f"rename device_type_id: {device_type_id}")
    print(f"name: {name}")
    print(f"color: {color}")
    print(f"icon: {icon}")

    response = (
        supabase
        .table("device_types")
        .update({
            "name": name,
            "color": color,
            "icon": icon
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

    return {
            "success": True,
            "device_type": response.data[0]
            }

def rename_device_model(
                        device_model_id: int,
                        name: str,
                        manufacturer: str | None = None
                        ):

    print(f"rename device_model_id: {device_model_id}")
    print(f"name: {name}")
    print(f"manufacturer: {manufacturer}")

    response = (
        supabase
        .table("device_models")
        .update({
            "name": name,
            "manufacturer": manufacturer
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

    return {
            "success": True,
            "device_model": response.data[0]
            }