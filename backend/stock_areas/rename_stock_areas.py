from common.supabase_client import (
    supabase
)

def rename_stock_area(
                      stock_area_id: int,
                      name: str,
                      ):
    print("rename_stock_area")
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
    return response.data[0]
