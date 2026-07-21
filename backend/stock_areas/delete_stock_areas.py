from common.supabase_admin_client import supabase

def delete_stock_areas(
                         stock_area_ids: list[int],
                         hospital_id:str
                       ):

    print(f"delete stock_areas")

    response = (
                  supabase
                  .table("stock_areas")
                  .delete()
                  .in_("id", stock_area_ids)
                  .eq("hospital_id", hospital_id)
                  .execute()
               )

    return response.data