from common.supabase_client import (
    supabase
)

def fetch_stock_areas(hospital_id: str):
    print("fetch_stock_areas")
    response = (
        supabase
        .table("stock_areas")
        .select("*")
        .eq(
            "hospital_id",
            hospital_id
        )
        .execute()
    )
    return response.data