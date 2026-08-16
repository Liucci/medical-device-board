from common.supabase_admin_client import supabase
from supabase import Client
from schemas.inspection_schemas.inspection_checklist_schemas import (
    UpdateInspectionChecklistRequest
)


def update_inspection_checklist(
    client: Client,
    inspection_checklist: UpdateInspectionChecklistRequest,
    hospital_id: str
):
    print("update_inspection_checklist")

    response = (
        client
        .table("inspection_checklists")
        .update({
            "inspection_type_id": inspection_checklist.inspection_type_id,
            "device_type_id": inspection_checklist.device_type_id,
            "device_model_id": inspection_checklist.device_model_id,
            "name": inspection_checklist.name,
            "version": inspection_checklist.version,
            "is_active": inspection_checklist.is_active
        })
        .eq("id", inspection_checklist.id)
        .eq("hospital_id", hospital_id)
        .execute()
    )

    return response.data[0]