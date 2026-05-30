from common.supabase_client import supabase
from stock_areas.add_stock_areas import add_stock_areas
from schemas.stock_area_schemas import AddStockAreaRequest

def create_stock_area_transaction(
                                    stock_area: AddStockAreaRequest,
                                    current_user
                                  ):

    print("create_stock_area_transaction")

    stock_area_response = add_stock_areas(
                                            stock_area=stock_area,
                                            current_user=current_user
                                        )

    return stock_area_response