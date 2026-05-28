from common.supabase_client import (
    supabase
)

def rename_maintenance_type(
                            maintenance_type_id: int,
                            name: str
                            ):
    print("rename_maintenance_type")
    try:
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

        return response.data[0]
    except Exception as e:
        print(
            f"rename_maintenance_types error: "
            f"{e}"
        )
        return []