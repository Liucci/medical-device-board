from common.supabase_client import (
    supabase
)

def delete_stock_area(
                      stock_area_id: int
                      ):

    print(f"delete stock_area_id: {stock_area_id}")

    response = (
        supabase
        .table("stock_areas")
        .delete()
        .eq(
            "id",
            stock_area_id
        )
        .execute()
    )

    print("delete response")

    for row in response.data:
        print(f"・{row}")

    return {
            "success": True,
            "stock_area": response.data[0]
            }