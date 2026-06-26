from common.supabase_client import supabase

from schemas.stock_area_schemas import AddStockAreaRequest


def add_stock_areas(
                      stock_area: AddStockAreaRequest,
                      hospital_id: str,
                      display_order: int
                    ):
    print("add_stock_areas")
    response = (
                  supabase
                  .table("stock_areas")
                  .insert({
                              "hospital_id": hospital_id,
                              "name":stock_area.name,
                              "display_order": display_order
                          })
                  .execute()
                )

    return response.data[0]
