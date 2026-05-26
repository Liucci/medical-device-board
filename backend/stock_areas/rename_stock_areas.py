from common.supabase_client import (
    supabase
)

def rename_stock_area(
                      stock_area_id: int,
                      name: str,
                      color: str | None = None
                      ):

    print(f"rename stock_area_id: {stock_area_id}")
    print(f"name: {name}")
    print(f"color: {color}")

    response = (
        supabase
        .table("stock_areas")
        .update({
            "name": name,
            "color": color
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

    return {
            "success": True,
            "stock_area": response.data[0]
            }