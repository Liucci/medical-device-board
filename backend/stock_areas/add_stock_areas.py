from common.supabase_client import (
    supabase
)

from schemas.stock_area_schemas import (
    AddStockAreaRequest
)


def add_stock_area(
                   stock_area:
                   AddStockAreaRequest
                   ):

    try:

        response = (
            supabase
            .table("stock_areas")
            .insert({
                "hospital_id":
                    stock_area.hospital_id,
                "name":
                    stock_area.name,
            })
            .execute()
        )

        return response.data[0]

    except Exception as e:

        print(
            f"add_stock_area error: "
            f"{e}"
        )

        return None