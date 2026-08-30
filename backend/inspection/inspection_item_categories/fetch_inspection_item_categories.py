from supabase import Client


def fetch_inspection_item_categories(
    client: Client,
    hospital_id: str
):
    print("fetch_inspection_item_categories")
    response = (
        client
        .table("inspection_item_categories")
        .select("*")
        .eq("hospital_id", hospital_id)
        .order("display_order")
        .execute()
    )

    return response.data