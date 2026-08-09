from supabase import Client


#hospital_idを軸にstock_areas一覧を取得
def fetch_stock_areas(
                      client:Client,
                      hospital_id: str
                      ):
    print("fetch_stock_areas")
    response = (
        client
        .table("stock_areas")
        .select("*")
        .eq(
            "hospital_id",
            hospital_id
        )
        .order("display_order")
        .execute()
    )
    return response.data


#任意のstock_area_idから該当する情報を取得
def fetch_stock_area(
                        client:Client,
                        stock_area_id:int,
                        hospital_id: str
                     ):

    print("fetch_stock_area")

    response = (
                    client
                    .table("stock_areas")
                    .select("*")
                    .eq("id", stock_area_id)
                    .eq("hospital_id", hospital_id)
                    .order("display_order")
                    .single()
                    .execute()
               )

    return response.data

#disply orderの最大値を取得する関数
def get_max_stock_area_display_order(
                                client:Client,
                                hospital_id: str
                            ) -> int:
    result = (
                    client
                    .table("stock_areas")
                    .select("display_order")
                    .eq("hospital_id", hospital_id)
                    .order("display_order", desc=True)
                    .limit(1)
                    .execute()
                )

    if not result.data:
        return 0

    return result.data[0]["display_order"]