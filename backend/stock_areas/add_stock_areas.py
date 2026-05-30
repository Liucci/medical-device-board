from common.supabase_client import supabase

from schemas.stock_area_schemas import AddStockAreaRequest


def add_stock_areas(
                      stock_area: AddStockAreaRequest,
                      current_user
                    ):

    response = (
                  supabase
                  .table("stock_areas")
                  .insert({
                              "hospital_id":
                                  current_user["hospital_id"],
                              "name":
                                  stock_area.name,
                          })
                  .execute()
                )

    return response.data[0]
