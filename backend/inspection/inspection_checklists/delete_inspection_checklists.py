from supabase import Client
from schemas.inspection_schemas.inspection_checklist_schemas import (
    DeleteInspectionChecklistsRequest
)


def delete_inspection_checklists(
    client: Client,
    inspection_checklist: DeleteInspectionChecklistsRequest,
    hospital_id: str
):
    print("delete_inspection_checklists")

    (
        client
        .table("inspection_checklists")
        .delete()
        .in_("id", inspection_checklist.ids)
        .eq("hospital_id", hospital_id)
        .execute()
    )