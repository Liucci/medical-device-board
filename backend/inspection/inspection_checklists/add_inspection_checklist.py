from supabase import Client
from schemas.inspection_schemas.inspection_checklist_schemas import (AddInspectionChecklistRequest)


def add_inspection_checklist(
    client: Client,
    inspection_checklist: AddInspectionChecklistRequest,
    hospital_id: str
):
    print("add_inspection_checklist")

    response = (
        client
        .table("inspection_checklists")
        .insert({
            "hospital_id": hospital_id,
            "inspection_type_id": inspection_checklist.inspection_type_id,
            "device_type_id": inspection_checklist.device_type_id,
            "device_model_id": inspection_checklist.device_model_id,
            "name": inspection_checklist.name,
            "version": inspection_checklist.version
        })
        .execute()
    )

    return response.data[0]