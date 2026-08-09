from supabase import Client


def fetch_stock_last_updated(
                            client:Client,
                            hospital_id:str
                        ):

    print("fetch_last_updated")

    response = (
        client
        .table("devices")
        .select("updated_at")
        .eq("hospital_id",hospital_id)
        .eq("status", "stock")
        .order("updated_at", desc=True)
        .limit(1)
        .execute()
    )

   
    print(response.data)
    return response.data[0]["updated_at"] if response.data else None