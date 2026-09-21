from supabase import Client
from schemas.inspection_schemas.inspection_checklist_item_options_schemas import (DeleteItemOptionsRequest)

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



# 複数のchecklist_item_idに紐づく全item optionを削除
def delete_inspection_checklist_item_options_by_item_ids(
    client: Client,
    inspection_checklist_item_options: DeleteItemOptionsRequest,
):
    print("delete_inspection_checklist_item_options")

    if not inspection_checklist_item_options.ids:
        return

    (
        client
        .table("inspection_checklist_item_options")
        .delete()
        .in_(
            "checklist_item_id",
            inspection_checklist_item_options.ids,
        )
        .execute()
    )