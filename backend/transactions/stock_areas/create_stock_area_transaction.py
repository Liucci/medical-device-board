from supabase import Client
from stock_areas.add_stock_areas import add_stock_areas
from schemas.stock_area_schemas import AddStockAreaRequest
from stock_areas.fetch_stock_areas import get_max_stock_area_display_order

def create_stock_area_transaction(
                                    client:Client,
                                    stock_area: AddStockAreaRequest,
                                    hospital_id: str
                                  ):

    print("create_stock_area_transaction")
    #最後の順番を取得しその次の順番を引数とする
    display_order =get_max_stock_area_display_order(
                                                    client,
                                                    hospital_id
                                                    ) + 1
   

    stock_area_response = add_stock_areas(
                                            client=client,
                                            stock_area=stock_area,
                                            hospital_id=hospital_id,
                                            display_order=display_order
                                        )

    return stock_area_response