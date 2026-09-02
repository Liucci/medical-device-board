from supabase import Client

#複数選択肢を一度にaddする関数
def add_inspection_checklist_item_options(
    client: Client,
    checklist_item_id: int,
    options: list[dict],
):
    print("add_inspection_checklist_item_options")
    print("client",client)
    data = [
        {
            "checklist_item_id": checklist_item_id,
            "value": option["value"],
            "display_order": option["display_order"],
        }
        for option in options
    ]
    if not data:
        return []

    (
        client
        .table("inspection_checklist_item_options")
        .insert(data)
        .execute()
    )

