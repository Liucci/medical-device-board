from common.supabase_admin_client import supabase

#複数stock area内にdeviceが存在するか判定
def exists_devices_in_stock_areas(
    stock_area_ids: list[int],
    hospital_id: str
) -> bool:
    print("exists_devices_in_stock areas")

    response = (
        supabase
        .table("devices")
        .select("id")
        .eq("hospital_id", hospital_id)
        .eq("status", "stock")
        .in_("stock_area_id", stock_area_ids)
        .limit(1)
        .execute()
    )

    return bool(response.data)