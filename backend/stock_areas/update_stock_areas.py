from supabase import Client
from schemas.stock_area_schemas import (UpdateStockAreaRequest,UpdateStockAreaOrderRequest)


def update_stock_area(
                      client:Client,
                      stock_area:UpdateStockAreaRequest,
                        hospital_id:str
                      ):

    print("update_stock_area")

    response = (
                  client
                  .table("stock_areas")
                  .update({"name": stock_area.name})
                  .eq("id", stock_area.id)
                  .eq("hospital_id", hospital_id)
                  .execute()
               )

    return response.data[0]


# 並び順更新用
def update_stock_area_display_order(
                                  client:Client,
                                  stock_area: UpdateStockAreaOrderRequest,
                                  hospital_id: str,
                              ):
    print("update_stock_area_display_order")
    (
        client
        .table("stock_areas")
        .update({
            "display_order": stock_area.display_order
        })
        .eq("id", stock_area.id)
        .eq("hospital_id", hospital_id)
        .execute()
    )