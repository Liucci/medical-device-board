from supabase import Client

#単一のchecklist idに紐づくitemsを取得
def fetch_inspection_checklist_items(
    client: Client,
    checklist_id: int
):
    print("fetch_inspection_checklist_items")

    response = (
        client
        .table("inspection_checklist_items")
        .select("*")
        .eq("checklist_id", checklist_id)
        .order("display_order")
        .execute()
    )

    return response.data

#特定のitem idの情報を取得
def fetch_inspection_checklist_item(
    client: Client,
    inspection_checklist_item_id: int
):
    print("fetch_inspection_checklist_item")

    response = (
        client
        .table("inspection_checklist_items")
        .select("*")
        .eq("id", inspection_checklist_item_id)
        .single()
        .execute()
    )

    return response.data


#複数のchecklist idに対するitems情報を取得
from supabase import Client


def fetch_inspection_checklist_items_by_checklist_ids(
                                                        client: Client,
                                                        checklist_ids: list[int]
                                                      ):
    print("fetch_inspection_checklist_items_by_checklist_ids")

    if not checklist_ids:
        return []

    response = (
        client
        .table("inspection_checklist_items")
        .select("id, checklist_id")
        .in_("checklist_id", checklist_ids)
        .execute()
    )

    return response.data