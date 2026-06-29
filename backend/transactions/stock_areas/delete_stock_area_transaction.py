from fastapi import HTTPException
from stock_areas.delete_stock_areas import delete_stock_areas
from schemas.stock_area_schemas import DeleteStockAreasRequest
from exists.exists_devices_in_stock_areas import (
    exists_devices_in_stock_areas
)

def delete_stock_area_transaction(
                                    stock_area: DeleteStockAreasRequest,
                                    hospital_id
                                  ):

    print("delete_stock_area_transaction")
    if exists_devices_in_stock_areas(
                                        stock_area.ids,
                                        hospital_id
                                    ):
        raise HTTPException(
            status_code=400,
            detail="倉庫内に機器が存在するため削除できません。"
        )



    stock_area_response = delete_stock_areas(
                                                stock_area_ids=stock_area.ids,
                                                hospital_id=hospital_id
                                             )

    return stock_area_response