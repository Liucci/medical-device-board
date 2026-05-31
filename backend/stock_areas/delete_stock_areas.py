from common.supabase_client import supabase

def delete_stock_areas(
                         stock_area_ids: list[int],
                         current_user
                       ):

    print(f"delete stock_area_ids: {stock_area_ids}")

    response = (
                  supabase
                  .table("stock_areas")
                  .delete()
                  .in_("id", stock_area_ids)
                  .eq("hospital_id", current_user["hospital_id"])
                  .execute()
               )

    return response.data