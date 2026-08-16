from supabase import Client

from inspection.inspection_checklist_items.delete_inspection_checklist_items import (
    delete_inspection_checklist_items
)
from inspection.inspection_checklists.delete_inspection_checklists import (
    delete_inspection_checklists
)


def delete_inspection_checklist_transaction(
    client: Client,
    checklist_ids: list[int],
    hospital_id: str
):
    print("delete_inspection_checklist_transaction")

    # 子tableを削除
    (
        client
        .table("inspection_checklist_items")
        .delete()
        .in_("checklist_id", checklist_ids)
        .execute()
    )

    # 親tableを削除
    delete_inspection_checklists(
        client,
        {
            "ids": checklist_ids
        },
        hospital_id
    )