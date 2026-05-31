from stock_areas.delete_stock_areas import delete_stock_areas
from schemas.stock_area_schemas import DeleteStockAreasRequest

def delete_stock_area_transaction(
                                    stock_area: DeleteStockAreasRequest,
                                    current_user
                                  ):

    print("delete_stock_area_transaction")

    stock_area_response = delete_stock_areas(
                                                stock_area_ids=stock_area.stock_area_ids,
                                                current_user=current_user
                                             )

    return stock_area_response