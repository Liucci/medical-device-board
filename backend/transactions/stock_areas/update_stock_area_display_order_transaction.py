from schemas.stock_area_schemas import UpdateStockAreaOrdersRequest
from stock_areas.update_stock_areas import update_stock_area_display_order
from supabase import Client


def update_stock_area_display_order_transaction(
                                                client:Client,
                                                stock_areas: UpdateStockAreaOrdersRequest,
                                                hospital_id: str,
                                                ):
    print("update_stock_area_display_order_transaction")

    for stock_area in stock_areas.stock_areas:
        update_stock_area_display_order(
                                        client,
                                        stock_area,
                                        hospital_id,
                                        )