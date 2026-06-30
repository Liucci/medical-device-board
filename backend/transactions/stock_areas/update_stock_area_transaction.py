from stock_areas.update_stock_areas import update_stock_area
from schemas.stock_area_schemas import UpdateStockAreaRequest
def update_stock_area_transaction(
                                    stock_area:UpdateStockAreaRequest,
                                    hospital_id:str
                                  ):

    print("update_stock_area_transaction")

    stock_area_response = update_stock_area(
                                            stock_area=stock_area,
                                            hospital_id=hospital_id
                                            )

    return stock_area_response