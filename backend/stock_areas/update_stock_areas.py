from common.supabase_client import supabase
from schemas.stock_area_schemas import UpdateStockAreaRequest
def update_stock_area(
                      stock_area:UpdateStockAreaRequest,
                        current_user
                      ):

    print("update_stock_area")

    response = (
                  supabase
                  .table("stock_areas")
                  .update({"name": stock_area.name})
                  .eq("id", stock_area.id)
                  .eq("hospital_id", current_user["hospital_id"])
                  .execute()
               )

    return response.data[0]