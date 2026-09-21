from supabase import Client


# 単一のchecklist idに紐づくitemsとoptionsを一括取得
def fetch_inspection_checklist_items_with_options(
    client: Client,
    checklist_id: int
):
    print("fetch_inspection_checklist_items_with_options")

    # checklistに紐づくitemsを取得
    items_response = (
        client
        .table("inspection_checklist_items")
        .select("*")
        .eq("checklist_id", checklist_id)
        .order("display_order")
        .execute()
    )

    items = items_response.data

    if not items:
        return []

    # itemsに紐づくitem_idを取得
    item_ids = [item["id"] for item in items]

    # 全itemのoptionsを一括取得
    options_response = (
        client
        .table("inspection_checklist_item_options")
        .select("*")
        .in_("checklist_item_id", item_ids)
        .order("display_order")
        .execute()
    )

    options = options_response.data

    # item_idごとにoptionsをまとめる
    options_by_item_id: dict[int, list] = {}

    for option in options:
        item_id = option["checklist_item_id"]

        if item_id not in options_by_item_id:
            options_by_item_id[item_id] = []

        options_by_item_id[item_id].append(option)

    # itemsにoptionsをネスト
    for item in items:
        item["options"] = options_by_item_id.get(item["id"], [])

    return items