from common.supabase_client import (
    supabase
)

def rename_stock_area(
                      stock_area_id: int,
                      name: str,
                      ):

    response = (
        supabase
        .table("stock_areas")
        .update({
            "name": name,
        })
        .eq(
            "id",
            stock_area_id
        )
        .execute()
    )

    print("rename response")

    for row in response.data:
        print(f"・{row}")

        return response.data[0]
