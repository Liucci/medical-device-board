from common.supabase_admin_client import supabase
from supabase import Client
from schemas.inspection_schemas.inspection_schemas import (
    UpdateInspectionRequest
)


def update_inspection(
    client: Client,
    inspection: UpdateInspectionRequest,
    hospital_id: str
):
    print("update_inspection")

    response = (
        client
        .table("inspections")
        .update({
            "room_id": inspection.room_id,
            "inspection_type_id": inspection.inspection_type_id,
            "checklist_id": inspection.checklist_id,
            "performed_at": inspection.performed_at,
            "overall_result": inspection.overall_result,
            "comment": inspection.comment
        })
        .eq("id", inspection.id)
        .eq("hospital_id", hospital_id)
        .execute()
    )

    return response.data[0]