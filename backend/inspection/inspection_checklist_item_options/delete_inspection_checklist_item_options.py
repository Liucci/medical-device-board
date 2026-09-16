from supabase import Client

#checklist_item_idに紐づく全item optionを削除する関数
def delete_inspection_checklist_item_options(
    client: Client,
    checklist_item_id: int,
):
    print("delete_inspection_checklist_item_options")

    (
        client
        .table("inspection_checklist_item_options")
        .delete()
        .eq("checklist_item_id", checklist_item_id)
        .execute()
    )