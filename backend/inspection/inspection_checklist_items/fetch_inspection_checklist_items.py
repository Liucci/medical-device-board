from common.supabase_admin_client import supabase
from supabase import Client


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