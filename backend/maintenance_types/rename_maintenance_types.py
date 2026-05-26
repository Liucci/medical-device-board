from common.supabase_client import (
    supabase
)

def rename_maintenance_type(
                            maintenance_type_id: int,
                            name: str
                            ):

    print(f"rename maintenance_type_id: {maintenance_type_id}")
    print(f"name: {name}")

    response = (
        supabase
        .table("maintenance_types")
        .update({
            "name": name
        })
        .eq(
            "id",
            maintenance_type_id
        )
        .execute()
    )

    print("rename response")

    for row in response.data:
        print(f"・{row}")

    return {
            "success": True,
            "maintenance_type": response.data[0]
            }