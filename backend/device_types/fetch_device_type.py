from supabase import Client


#全取得
def fetch_device_types(
                        client:Client,
                        hospital_id: str
                        ):
    print("fetch_device_types")
    response = (
            client
            .table("device_types")
            .select("*")
            .eq(
                "hospital_id",
                hospital_id
            )
            .order("display_order")
            .execute()
        )
    return response.data
    
#個別取得
def fetch_device_type(
                        client:Client,
                        device_type_id: int,
                        hospital_id: str
                     ):

    print("fetch_device_type")

    response = (
                    client
                    .table("device_types")
                    .select("*")
                    .eq("id", device_type_id)
                    .eq("hospital_id", hospital_id)
                    .single()
                    .execute()
               )

    return response.data


# display_orderの最大値を取得
def get_max_device_type_display_order(
                                        client: Client,
                                        hospital_id: str
                                    ) -> int:

    result = (
        client
        .table("device_types")
        .select("display_order")
        .eq("hospital_id", hospital_id)
        .order("display_order", desc=True)
        .limit(1)
        .execute()
    )

    if not result.data:
        return 0

    return result.data[0]["display_order"]