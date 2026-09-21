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
    #print("checklist_item_options:",response)
    return response.data


# 複数のchecklist_item_idに紐づく全item optionを取得
def fetch_item_options_by_item_ids(
    client: Client,
    checklist_item_ids: list[int],
):
    print("fetch_item_options_by_item_ids")

    if not checklist_item_ids:
        return []

    response = (
        client
        .table("inspection_checklist_item_options")
        .select("*")
        .in_("checklist_item_id", checklist_item_ids)
        .order("checklist_item_id")
        .order("display_order")
        .execute()
    )

    return response.data