from supabase import Client

#選択し複数まとめて取得
def fetch_inspection_checklist_item_options(
    client: Client,
    checklist_item_id: int
):
    print("fetch_inspection_checklist_item_options")

    response = (
        client
        .table("inspection_checklist_item_options")
        .select("*")
        .eq("checklist_item_id", checklist_item_id)
        .order("display_order")
        .execute()
    )

    return response.data
