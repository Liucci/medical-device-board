from common.supabase_client import (
    supabase
)

def delete_maintenance_type(maintenance_type_id: int):

    print("delete_maintenance_type")
    try:
        response = (
            supabase
            .table("maintenance_types")
            .delete()
            .eq(
                "id",
                maintenance_type_id
            )
            .execute()
        )

        print("delete response")
        for row in response.data:
            print(f"・{row}")
        return response.data[0]
    except Exception as e:
        print(
            f"delete_maintenance_types error: "
            f"{e}"
        )
        return []